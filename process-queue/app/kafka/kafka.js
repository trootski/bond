const kafka = require('kafka-node');
const { promisify } = require('util');

const { Consumer, Offset, Producer } = kafka;

const setTimeoutAsync = promisify(setTimeout);

const handleErr = logger => rej => err => {
  logger.error({ err });
  rej(err);
};

const checkTopicAvailable = ({ config, logger }) => new Promise(async (rslv, rej) => {
  const handleRejection = handleErr(logger)(rej);
  try {
    const client = new kafka.KafkaClient({
      kafkaHost: config.get('kafka:url'),
    });
    const admin = new kafka.Admin(client);
    admin.on('error', handleRejection);
    admin.listTopics((err, data) => {
      if (err) handleRejection(err);
      rslv(data);
    });
  } catch (err) {
    handleRejection(err);
  }
});

const waitForHostAndTopic = async ({ config, logger }) => {
  do {
    try {
      const rslt = await checkTopicAvailable({ config, logger });
      if (rslt && rslt[1] && rslt[1].metadata) {
        if (rslt[1].metadata['BondMoviesToBeProcessed']) {
          logger.info({ type: 'HOST_WAIT_INFO', msg: 'Kafka and topic found' });
          return true;
        } else {
          logger.info({ type: 'HOST_WAIT_INFO', msg: 'Kafka found' });
          return false;
        }
      }
      logger.info({ type: 'HOST_WAIT_INFO', msg: 'Kafka topic not found, retrying...' });
      await setTimeoutAsync(1000);
    } catch (err) {
      logger.error({ type: 'HOST_WAIT_ERROR', err });
    }
  } while(true);
};

const createTopic = async ({ config, logger, topicName }) => new Promise((rslv, rej) => {
  try {
    const client = new kafka.KafkaClient({
      kafkaHost: config.get('kafka:url'),
    });
    const topicsToCreate = [{
      topic: topicName,
      partitions: 1,
      replicationFactor: 1
    }];
    client.createTopics(topicsToCreate, (err, data) => {
      if (err) { logger.error({ err }); rej(err); }
      rslv(data);
    });
  } catch (err) {
    logger.error({ err });
    rej(err);
  }
});

const getConsumer = async ({ config }) => {
  const client = new kafka.KafkaClient({
    kafkaHost: config.get('kafka:url'),
  });
  const offset = new Offset(client);
  const consumer = new Consumer(client, [
    { topic: 'BondMoviesToBeProcessed', partitions: 0 },
  ], { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 });
  return consumer;
};

const getProducer = async ({ config }) => {
  const client = new kafka.KafkaClient({
    kafkaHost: config.get('kafka:url'),
  });

  return new Producer(client);
};

module.exports = {
  checkTopicAvailable,
  createTopic,
  getConsumer,
  getProducer,
  waitForHostAndTopic,
};
