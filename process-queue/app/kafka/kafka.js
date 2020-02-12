const kafka = require('kafka-node');
const { promisify } = require('util');

let client, consumer, producer;

const { Consumer, Offset, Producer } = kafka;

const setTimeoutAsync = promisify(setTimeout);

const handleErr = logger => rej => err => {
  logger.error({ err });
  rej(err);
};

const getClient = config => {
  if (client) return client;
  return new kafka.KafkaClient({
    kafkaHost: config.get('kafka:url'),
  });
};

const checkTopicAvailable = ({ config, logger }) => new Promise(async (rslv, rej) => {
  const handleRejection = handleErr(logger)(rej);
  try {
    const client = getClient(config);
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
        if (rslt[1].metadata[config.get('kafka:bond_topic')]) {
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
    const client = getClient(config);
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

const getConsumer = ({ config, logger }) => new Promise((resolve, reject) => {
  if (consumer) return resolve(consumer);
  const client = getClient(config);
  consumer = new Consumer(
    client,
    [{ topic: config.get('kafka:bond_topic'), partitions: 0 },],
    { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 }
  );
  client.refreshMetadata([config.get('kafka:bond_topic')], err => {
    const offset = new Offset(client);
    if (err) {
      logger.error({ type: "CONSUMER_METADATA_REFRESH", err });
      reject(null);
    }
    consumer.on('error', err => {
      logger.error({ type: "CONSUMER_ERR", err });
      process.exit(1);
    });
    consumer.on(
      'offsetOutOfRange',
      topic => {
        offset.fetch([topic], function(err, offsets) {
          if (err) {
            logger.error({ err, type: "CONSUMER_OFFSET_OUT_OF_RANGE" });
            return;
          }
          const min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
          consumer.setOffset(topic.topic, topic.partition, min);
        });
      }
    );
    return resolve(consumer);
  });
});

const getProducer = ({ config, logger }) => new Promise((resolve, reject) => {
  if (producer) return resolve(producer);

  const client = getClient(config);
  producer = new Producer(client);

  producer.on('ready', () => {
    client.refreshMetadata([config.get('kafka:bond_topic')], err => {
      if (err) {
        logger.error({ type: 'KAFKA_PRODUCER_META_REFRESH', err });
        return reject(err);
      }
      resolve(producer);
    });
  });
  producer.on('error', err => {
    logger.error({ err });
  })
});

module.exports = {
  checkTopicAvailable,
  createTopic,
  getConsumer,
  getProducer,
  waitForHostAndTopic,
};
