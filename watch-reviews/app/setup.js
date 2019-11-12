#!/usr/bin/env node

const config = require('nconf');
const fg = require('fast-glob');
const kafka = require('kafka-node');
const logger = require('pino')();
const { promisify } = require('util');
const watch = require('glob-watcher');

const { Producer, KeyedMessage } = kafka;

// Raw chokidar instance
const watcher = watch(['./storage/**/*'], { ignoreInitial: false });

config.file(`/opt/watch_reviews/config/config.json`);

logger.info({ code: 'WATCH_REVIEW_START', msg: `Starting up...\n\n
Settings: ${JSON.stringify(config.get())}` });

const client = new kafka.KafkaClient({
  kafkaHost: config.get('kafka:url'),
});

const producer = new Producer(client);

process.on('uncaughtException', function (err) {
  logger.error({ code: 'WATCH_REVIEW_ERROR', error: err.message });
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ code: 'WATCH_REVIEW_ERROR', error: (reason.stack || reason) });
  process.exit(0);
});

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
