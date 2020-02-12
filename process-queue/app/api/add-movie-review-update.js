const fs = require('fs');
const logger = require('pino')().child({ app: 'PROCESS_QUEUE' });
const { getProducer } = require('../kafka/kafka.js');
const { KeyedMessage } = require('kafka-node');

const postMessage = ({ body, config, logger }) => new Promise(async (reslv, rej) => {
  const producer = await getProducer({ config, logger });
  const km = new KeyedMessage('reviewData', JSON.stringify(body));
  const payloads = [
    {
      topic: config.get('kafka:bond_topic'),
      messages: [km],
      partition: 0,
    },
  ];
  producer.send(payloads, (err, data) => {
    if (err) {
      logger.error({ type: 'PRODUCER_SEND_ERR', err });
      rej(err);
    }
    logger.info({ type: 'PRODUCER_SEND', data: JSON.stringify(data) });
    reslv(data);
  });
});

const addMovieReviewUpdate = async (ctx, next) => {
  const { request: { body }, config, logger } = ctx;
  logger.info({ type: 'ingress' });
  try {
    await postMessage({ body, config, logger });
    ctx.status = 207;
    ctx.body = '';
  } catch (err) {
    logger.error({ err });
    ctx.status = 500;
    ctx.body = '';
  }

  await next();
};

module.exports = addMovieReviewUpdate;
