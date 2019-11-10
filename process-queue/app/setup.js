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

(async () => {
  logger.info({
    code: 'PROCESS_QUEUE_START',
    msg: `Starting up...\n\nkafkaHost: ${config.get('kafka:url')}` });
  const client = new kafka.KafkaClient({
    kafkaHost: config.get('kafka:url'),
  });
  const offset = new Offset(client);
  const consumer = new Consumer(client, [
    { topic: 'BondMoviesToBeProcessed', partitions: 0 },
  ], { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 });

  consumer.on('message', async m => {
    logger.info({ code: 'CONSUMER_MESSAGE', data: m });
    const fname = (m.value.match(/storage\/reviews\/(.+)$/) || [])[1];
    const stub = (m.value.match(/(.+)\/(.+)(\.md)$/) || [])[2];
    try {
      const markdown = fs.readFileSync(`/opt/process_queue/storage/reviews/${fname}`, 'utf8');
      const html = converter.makeHtml(markdown);
      const filmEntry = filmData.data.find(v => v.review === fname);
      logger.info({ code: 'CONSUMER_INFO', filmEntry });

      const client = redis.createClient({
        host: config.get('redis:url'),
        port: config.get('redis:port'),
      });
      const getAsync = promisify(client.get).bind(client);
      const OMDBData = await getAsync(filmEntry.title);

      const dataToPersist = {
        ...filmEntry,
        ...(JSON.parse(OMDBData)),
        html,
      };
      logger.info({ code: 'CONSUMER_INFO', dataToPersist });


      const dynamoDbParams = {
        apiVersion: config.get('dynamodb:apiVersion'),
        convertEmptyValues: true,
        accessKeyId: config.get('dynamodb:accessKeyId'),
        secretAccessKey: config.get('dynamodb:secretAccessKey'),
        endpoint: config.get('dynamodb:dynamoDBEndpoint'),
        logger,
        region: config.get('dynamodb:region'),
      };

      logger.info('Connecting to DynamoDB...');
      const dynamodb = await new AWS.DynamoDB(dynamoDbParams);

      const checkItem = await dynamodb.getItem({
        TableName: 'BondMovies',
        Key: {
          "Director": {
            S: "Martin Campbell",
           },
          "MovieTitle": {
            S: "Casino Royale",
           }
        },
      }).promise();
      logger.info({ code: 'CONSUMER_INFO', msg: `Results: ${JSON.stringify(checkItem)}` });

      // logger.info({ code: 'CONSUMER_INFO', msg: `Setting new entry ${dataToPersist.title}` });
      // const createRecord = await dynamodb.putItem({
      //   TableName: 'BondMovies',
      //   Item: dataToPersist,
      // }).promise();

      // logger.info({ code: 'CONSUMER_INFO', createRecord });
    } catch (e) {
      logger.error({ code: 'CONSUMER_ERROR', error: e });
    }
  });

  consumer.on('error', err => {
    logger.error({ code: 'CONSUMER_ERROR', error: err });
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
