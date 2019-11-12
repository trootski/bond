#!/usr/bin/env node

const AWS = require('aws-sdk');
const config = require('nconf');
const fs = require('fs');
const kafka = require('kafka-node');
const logger = require('pino')();
const redis = require("redis");
const showdown = require('showdown');
const { promisify } = require('util');

const { Consumer, Offset } = kafka;
const filmData = require('/opt/process_queue/storage/film-meta.json');

config.file(`./config/config.json`);

const converter = new showdown.Converter();

const setTimeoutAsync = promisify(setTimeout);

process.on('uncaughtException', function (err) {
  logger.error({ code: 'CONSUMER_ERROR', error: err.message });
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ code: 'CONSUMER_ERROR', error: (reason.stack || reason) });
  process.exit(0);
});

const handleErr = rej => err => {
  logger.error({ code: 'ADMIN_ERROR', error: err.message });
  rej(err);
};

(async () => {
  const checkTopicAvailable = () => new Promise(async (rslv, rej) => {
    try {
      const handleRejection = handleErr(rej); 
      const client = new kafka.KafkaClient({
        kafkaHost: config.get('kafka:url'),
      });
      const admin = new kafka.Admin(client);
      admin.on('error', handleRejection);
      admin.listTopics((err, data) => {
        if (err) handleRejection(err);
        rslv(data);
      });
    } catch (err) {
      handleRejection(err);
    }
  });
  const waitForHostAndTopic = async () => {
    do {
      try {
        const rslt = await checkTopicAvailable();
        if (rslt && rslt[1] && rslt[1].metadata && rslt[1].metadata['BondMoviesToBeProcessed']) {
          return rslt;
        }
        logger.info({ code: 'HOST_WAIT_INFO', msg: 'Kafka topic not found, retrying...', rslt });
        await setTimeoutAsync(1000);
      } catch (e) {
        logger.error({ code: 'HOST_WAIT_ERROR', error: e.message });
      }
    } while(true);
  }
  await waitForHostAndTopic();
  const client = new kafka.KafkaClient({
    kafkaHost: config.get('kafka:url'),
  });
  const offset = new Offset(client);
  const consumer = new Consumer(client, [
    { topic: 'BondMoviesToBeProcessed', partitions: 0 },
  ], { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 });

  consumer.on('message', async m => {
    const fname = (m.value.match(/storage\/reviews\/(.+)$/) || [])[1];
    const stub = (m.value.match(/(.+)\/(.+)(\.md)$/) || [])[2];
    if (!fname || !stub) return;
    logger.info({ code: 'CONSUMER_MESSAGE_RECEIVED', fname, stub });
    try {
      const markdown = fs.readFileSync(`/opt/process_queue/storage/reviews/${fname}`, 'utf8');
      const html = converter.makeHtml(markdown);
      const filmEntry = filmData.data.find(v => v.review === fname);

      const client = redis.createClient({
        host: config.get('redis:url'),
        port: config.get('redis:port'),
      });
      const getAsync = promisify(client.get).bind(client);
      const OMDBData = JSON.parse((await getAsync(filmEntry.title)));

      if (OMDBData) {

        const dynamoDbParams = {
          apiVersion: config.get('dynamodb:apiVersion'),
          convertEmptyValues: true,
          accessKeyId: config.get('dynamodb:accessKeyId'),
          secretAccessKey: config.get('dynamodb:secretAccessKey'),
          endpoint: config.get('dynamodb:dynamoDBEndpoint'),
          logger,
          region: config.get('dynamodb:region'),
        };

        const client = await new AWS.DynamoDB(dynamoDbParams);
        const dynamodb = await new AWS.DynamoDB.DocumentClient({
          params: dynamoDbParams,
          service: client,
          convertEmptyValues: true,
        });

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
    } catch (e) {
      logger.error({ code: 'CONSUMER_MESSAGE_ERROR', error: e });
    }
  });

  consumer.on('error', err => {
    logger.error({ code: 'CONSUMER_ERROR', error: err.message, msg: 'HERE' });
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
