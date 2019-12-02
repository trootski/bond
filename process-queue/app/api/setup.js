const fs = require('fs');
const logger = require('pino')().child({ app: 'PROCESS_QUEUE' });
const showdown = require('showdown');
const { createTopic, getConsumer, waitForHostAndTopic } = require('../kafka/kafka.js');

const setup = async (ctx, next) => {
  const { config, logger } = ctx;
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
  await next();
};

module.exports = setup;
