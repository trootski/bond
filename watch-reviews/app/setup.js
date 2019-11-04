#!/usr/bin/env node

const logger = require('pino')();
const config = require('nconf');
const { promisify } = require('util');
const kafka = require('kafka-node');
const { Producer, KeyedMessage } = kafka;
const watch = require('glob-watcher');
const fg = require('fast-glob');

// Raw chokidar instance
const watcher = watch(['./storage/**/*'], { ignoreInitial: false });

logger.info({ code: 'WATCH_REVIEW_START', msg: `Starting up...\n\nCACHE_ENV: ${process.env.CACHE_ENV}\n\nDIR: ${__dirname}\n\nSettings: ${JSON.stringify(config.get())}` });

config.file(`./config/config.json`);

if (process.env.CACHE_ENV) {
  config.file(`./config/config.${process.env.CACHE_ENV}.json`);
}

const client = new kafka.KafkaClient({
  kafkaHost: config.get('app:kafka_url'),
});

const producer = new Producer(client);

(async () => {
  const entries = await fg(['/opt/watch_reviews/storage/**/*']);

  const postMovieToProcess = reviewFileName => {
    const km = new KeyedMessage('reviewFileName', reviewFileName);
    const payloads = [
        { topic: 'BondMoviesToBeProcessed', messages: [km] }
    ];
    producer.send(payloads, (err, data) => {
      if (err) {
        logger.info({ code: 'PRODUCER_SEND_ERROR', err });
      }
      logger.info({ code: 'PRODUCER_SEND', data });
    });
  };

  producer.on('ready', () => {
    watcher.on('change', path => {
      logger.info({ code: 'PRODUCER_FILE_CHANGE', data: { path } });
      postMovieToProcess(path);
    });

    watcher.on('add', path => {
      logger.info({ code: 'PRODUCER_FILE_ADD', data: { path } });
      postMovieToProcess(path);
    });
  });

  producer.on('error', err => {
    logger.error({ code: 'PRODUCER_ERROR', error: err });
  });
})();
