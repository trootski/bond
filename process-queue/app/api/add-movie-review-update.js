const fs = require('fs');
const logger = require('pino')().child({ app: 'PROCESS_QUEUE' });
const { getProducer } = require('../kafka/kafka.js');
const { KeyedMessage } = require('kafka-node');

const postMessage = ({ body, config, logger }) => new Promise(async (reslv, rej) => {
  const producer = await getProducer({ config });

  producer.on('ready', () => {
    logger.info({ msg: 'Kafka ready to receive messages' })
    const km = new KeyedMessage('reviewData', body);
    const payloads = [
        {
          topic: config.get('kafka:bond_topic'),
          messages: [km],
        },
    ];
    producer.send(payloads, (err, data) => {
      if (err) {
        logger.info({ err });
        rej(err);
      }
      logger.info({ type: 'PRODUCER_SEND', data });
      reslv(data);
    });
  });
  producer.on('error', err => {
    logger.error({ err });
    rej(err);
  });
});

const addMovieReviewUpdate = async (ctx, next) => {
  const { request: { body }, config, logger } = ctx;

  logger.info({ msg: 'received', b: body });
  try {
    await postMessage({ body, config, logger });
    ctx.status = 204;
    ctx.body = '';
  } catch (err) {
    logger.error({ err });
    ctx.status = 500;
    ctx.body = '';
  }

  await next();
};

module.exports = addMovieReviewUpdate;
