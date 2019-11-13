#!/usr/bin/env node

const logger = require('pino')().child({ app: 'QUEUE_SETUP' });
const config = require('nconf');
const { promisify } = require('util');
const kafka = require('kafka-node');
const { createTopic, getConsumer, waitForHostAndTopic } = require('./utils/kafka.js');
const registerUncaughtErrors = require('./utils/uncaught-errors.js');

const setTimeoutAsync = promisify(setTimeout);

config.file(`/opt/queue_setup/config/config.json`);

const topicName = 'BondMoviesToBeProcessed';

logger.info({ type: 'START', msg: `Connecting to Kafka
Settings: ${JSON.stringify(config.get())}` });

registerUncaughtErrors({ logger: logger.child({ type: 'UNCAUGHT_ERROR' }) });

const handleErr = rej => err => {
  logger.error({ type: 'ADMIN_ERROR', err });
  rej(err);
};

(async () => {
  try {
    const isTopicAvailable = await waitForHostAndTopic({ logger, config });

    if (isTopicAvailable) {
      logger.info({ msg: 'Topic already exists' });
    } else {
      logger.info({ msg: `Creating topic: ${topicName}` });
      await createTopic({ config, logger, topicName });
    }

    process.exit(0);
  } catch (err) {
    logger.error({ err });
  }
})();
