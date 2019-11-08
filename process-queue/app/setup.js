#!/usr/bin/env node

const logger = require('pino')();
const config = require('nconf');
const { promisify } = require('util');
const kafka = require('kafka-node');
const showdown = require('showdown');
const { Consumer, Offset } = kafka;
const fs = require('fs');
const filmData = require('/opt/process_queue/storage/film-meta.json');

config.file(`./config/config.json`);

const converter = new showdown.Converter();

(async () => {
  logger.info({
    code: 'PROCESS_QUEUE_START',
    msg: `Starting up...\n\nkafkaHost: ${config.get('app:kafka_url')}` });
  const client = new kafka.KafkaClient({
    kafkaHost: config.get('app:kafka_url'),
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
      const dataToPersist = {
        ...filmEntry,
        ...{ html, markdown },
      };
      logger.info({ code: 'CONSUMER_INFO', dataToPersist });
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
