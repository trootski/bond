#!/usr/bin/env node

const logger = require('pino')();
const config = require('nconf');
const { promisify } = require('util');
const kafka = require('kafka-node');
const { Producer, KeyedMessage } = kafka;

logger.info('Starting up...');
logger.info(`CACHE_ENV: ${process.env.CACHE_ENV}`);
logger.info(`DIR: ${__dirname}`);

config.file(`./config/config.json`);

if (process.env.CACHE_ENV) {
  config.file(`./config/config.${process.env.CACHE_ENV}.json`);
}
logger.info(`Settings: ${JSON.stringify(config.get())}`);


(async () => {
  const client = new kafka.KafkaClient({
    kafkaHost: config.get('app:kafka_url'),
  });
  const producer = new Producer(client);
  const km = new KeyedMessage('key', 'message');
  const payloads = [
      { topic: 'BondMoviesToBeProcessed', messages: [km] }
  ];
  producer.on('ready', () => {
    logger.info({ code: 'PRODUCER_READY' });
    producer.send(payloads, (err, data) => {
      if (err) {
        logger.error({ code: 'PRODUCER_SEND', error: err });
        process.exit(1);
      }
      logger.info({ code: 'PRODUCER_SEND', data });
      process.exit(0);
    });
  });

  producer.on('error', err => {
    logger.error({ code: 'PRODUCER_ERROR', error: err });
  });
})();
