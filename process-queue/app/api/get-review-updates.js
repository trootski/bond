const fs = require('fs');
const logger = require('pino')().child({ app: 'PROCESS_QUEUE' });
const { Admin } = require('kafka-node');
const getQueueLength = require('../service/queue.js');

const getReviewUpdates = async (ctx, next) => {
  const { config, logger } = ctx;
  logger.info({msg: 'started'});
  try {
    const queueLength = await getQueueLength({ config, logger });
    ctx.body = queueLength;
    ctx.status = 200;
    ctx.body = '';
  } catch (err) {
    logger.error({ err });
    ctx.status = 500;
    ctx.body = '';
  }

  await next();
};

module.exports = getReviewUpdates;
