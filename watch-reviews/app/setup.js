#!/usr/bin/env node

const config = require('nconf');
const fg = require('fast-glob');
const kafka = require('kafka-node');
const logger = require('pino')().child({ app: 'WATCH_REVIEWS' });
const watch = require('glob-watcher');
const { getProducer, waitForHostAndTopic } = require('./utils/kafka.js');
const registerUncaughtErrors = require('./utils/uncaught-errors.js');

const { KeyedMessage } = kafka;

config.file(`/opt/watch_reviews/config/config.json`);

logger.info({
  type: 'START',
  msg: `Starting up...\n\nSettings: ${JSON.stringify(config.get())}`,
});

registerUncaughtErrors({ logger });

(async () => {
  // Raw chokidar instance
  const watcher = watch(['./storage/**/*'], { ignoreInitial: false });

  await waitForHostAndTopic({ logger, config });

  producer = await getProducer({ config });

  const postMovieToProcess = reviewFileName => {
    const km = new KeyedMessage('reviewFileName', reviewFileName);
    const payloads = [
        { topic: 'BondMoviesToBeProcessed', messages: [km] }
    ];
    producer.send(payloads, (err, data) => {
      if (err) {
        logger.info({ err });
      }
      logger.info({ type: 'PRODUCER_SEND', data });
    });
  };

  producer = await getProducer({ config });
  producer.on('ready', () => {
    logger.info({ msg: 'Kafka ready to receive messages' })
    watcher.on('change', path => {
      logger.info({ type: 'PRODUCER_FILE_CHANGE', data: { path } });
      postMovieToProcess(path);
    });

    watcher.on('add', path => {
      logger.info({ type: 'PRODUCER_FILE_ADD', data: { path } });
      postMovieToProcess(path);
    });
  });

  producer.on('error', err => {
    logger.error({ err });
  });
})();
