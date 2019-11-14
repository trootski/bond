#!/usr/bin/env node

const config = require('nconf');
const fs = require('fs');
const logger = require('pino')().child({ app: 'PROCESS_QUEUE' });
const showdown = require('showdown');
const { getDocumentClient } = require('./utils/dynamo.js');
const { getConsumer, waitForHostAndTopic } = require('./utils/kafka.js');
const { getAsync } = require('./utils/redis.js');
const registerUncaughtErrors = require('./utils/uncaught-errors.js');

config.file(`./config/config.json`);

const converter = new showdown.Converter();

registerUncaughtErrors({ logger });

const getReviewHTML = async (fname) => {
  const markdown = fs.readFileSync(`/opt/process_queue/storage/reviews/${fname}`, 'utf8');
  return converter.makeHtml(markdown);
}

const getOMDBData = async ({ config, fname, logger }) => {
  logger.info({ type: 'getOMDBData', msg: fname });
  const filmData = require('/opt/process_queue/storage/film-meta.json');
  const filmEntry = filmData.data.find(v => v.review === fname);
  const redisGet = getAsync({ config, logger });
  if (filmEntry) {
    return JSON.parse((await redisGet(filmEntry.title)));
  } else {
    return null;
  }
};

(async () => {
  logger.info({ type: 'START', msg: 'starting' });

  await waitForHostAndTopic({ logger, config });

  const consumer = await getConsumer({ logger, config });
  consumer.on('message', async m => {
    logger.info({ type: 'CONSUMER_MESSAGE_RECEIVED', msg: m });
    const fname = (m.value.match(/storage\/reviews\/(.+)$/) || [])[1];
    const stub = (m.value.match(/(.+)\/(.+)(\.md)$/) || [])[2];
    if (!fname || !stub) return;
    try {
      const movieReviewHTML = getReviewHTML(fname);

      const OMDBData = await getOMDBData({ config, fname, logger });

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
          movieReviewHTML,
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

        logger.info({ msg: 'DynamoDB item created', createRecord, dataToPersist });
      } else {
        logger.info({ type: 'OMDB_DATA_MISSING', msg: OMDBData });
      }
    } catch (err) {
      logger.error({ err });
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
