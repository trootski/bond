#!/usr/bin/env node

const config = require('nconf');
const fg = require('fast-glob');
const kafka = require('kafka-node');
const logger = require('pino')();
const watch = require('glob-watcher');
const { getProducer, waitForHostAndTopic } = require('./utils/kafka.js');
const registerUncaughtErrors = require('./utils/uncaught-errors.js');

const { KeyedMessage } = kafka;

// Raw chokidar instance
const watcher = watch(['./storage/**/*'], { ignoreInitial: false });

config.file(`/opt/watch_reviews/config/config.json`);

logger.info({ code: 'WATCH_REVIEW_START', msg: `Starting up...\n\n
Settings: ${JSON.stringify(config.get())}` });

registerUncaughtErrors({ logger: logger.child({ code: 'WATCH_REVIEW_ERROR' }) });

(async () => {
  await waitForHostAndTopic({ logger, config });
  producer = await getProducer({ config });
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
    logger.error({ code: 'PRODUCER_ERROR', err });
  });
})();
