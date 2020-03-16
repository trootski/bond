const { connectAndCreateTopic, startQueueListener } = require('../service/queue.js');

const setup = async (ctx, next) => {
  const { config, logger } = ctx;

  try {
    await connectAndCreateTopic({ config, logger });

    await startQueueListener({ config, logger });
  } catch (err) {
    logger.error({ type: 'QUEUE_SETUP_ERROR', err });
    throw err;
  }
  await next();
};

module.exports = setup;
