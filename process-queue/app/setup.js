#!/usr/bin/env node

const config = require('nconf');
const fs = require('fs');
const logger = require('pino')();
const showdown = require('showdown');
const { getDocumentClient } = require('./utils/dynamo.js');
const { getConsumer, waitForHostAndTopic } = require('./utils/kafka.js');
const { getAsync } = require('./utils/redis.js');
const registerUncaughtErrors = require('./utils/uncaught-errors.js');

const filmData = require('/opt/process_queue/storage/film-meta.json');

config.file(`./config/config.json`);

const converter = new showdown.Converter();

registerUncaughtErrors({ logger: logger.child({ code: 'CONSUMER_ERROR' }) });

(async () => {
  logger.info({ code: 'CONSUMER_START', msg: 'starting' });
  await waitForHostAndTopic({ logger, config });
  const consumer = await getConsumer({ logger, config });
  consumer.on('message', async m => {
    const fname = (m.value.match(/storage\/reviews\/(.+)$/) || [])[1];
    const stub = (m.value.match(/(.+)\/(.+)(\.md)$/) || [])[2];
    if (!fname || !stub) return;
    logger.info({ code: 'CONSUMER_MESSAGE_RECEIVED', fname, stub });
    try {
      const markdown = fs.readFileSync(`/opt/process_queue/storage/reviews/${fname}`, 'utf8');
      const html = converter.makeHtml(markdown);
      const filmEntry = filmData.data.find(v => v.review === fname);

      const redisGet = getAsync({ config, logger });
      const OMDBData = JSON.parse((await redisGet(filmEntry.title)));

      if (OMDBData) {
        const dynamodb = await getDocumentClient({ config, logger });

        const checkItem = await dynamodb.get({
          TableName: 'BondMovies',
          Key: {
            'Director': OMDBData.Director,
            'MovieTitle': OMDBData.Title,
          },
        }).promise();

        const dateCreated = (checkItem.Item) ? checkItem.Item.dateCreated : new Date().toISOString();
        const dataToPersist = {
          ...filmEntry,
          ...OMDBData,
          html,
          ...{
           "Director": OMDBData.Director,
           "MovieTitle": OMDBData.Title,
           dateCreated: dateCreated,
          }
        };
        const createRecord = await dynamodb.put({
          Item: dataToPersist,
          ReturnConsumedCapacity: 'TOTAL',
          TableName: 'BondMovies',
        }).promise();

        logger.info({ code: 'CONSUMER_INFO', createRecord, dataToPersist });
      }
    } catch (err) {
      logger.error({ code: 'CONSUMER_MESSAGE_ERROR', err });
    }
  });

  consumer.on('error', err => {
    logger.error({ code: 'CONSUMER_ERROR', err });
  });

  /*
  * If consumer get `offsetOutOfRange` event, fetch data from the smallest(oldest) offset
  */
  consumer.on('offsetOutOfRange', function (topic) {
    topic.maxNum = 2;
    offset.fetch([topic], function (err, offsets) {
      if (err) {
        return console.error(err);
      }
      var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
      consumer.setOffset(topic.topic, topic.partition, min);
    });
  });
})();
