const { connectAndCreateTopic, startQueueListener } = require('../service/queue.js');

const setup = async ({ config, logger }) => {
  try {
    await connectAndCreateTopic({ config, logger });

    await startQueueListener({ config, logger });
  } catch (err) {
    logger.error({ type: 'QUEUE_SETUP_ERROR', err });
    throw err;
  }
};

module.exports = setup;
