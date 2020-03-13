const { promisify } = require('util');

let admin, client, consumer, producer;

const { Kafka, logLevel } = require('kafkajs');

const setTimeoutAsync = promisify(setTimeout);

const getClient = config => {
  if (client) return client;
  client = new Kafka({
    brokers: [config.get('kafka:url')],
    clientId: 'bond-kafka-queue-consumer-local',
    logLevel: logLevel.ERROR,
    retry: {
      initialRetryTime: 1000,
      retries: 8
    }
  });
  return client;
};

const checkTopicAvailable = ({ config, logger }) => new Promise(async (rslv, rej) => {
  try {
    rslv(topicMetadata);
  } catch (err) {
    logger.error({ type: 'CHECK_TOPIC_AVAILABLE', err });
  }
});

const waitForHostAndTopic = async ({ config, logger }) => {
  const kafka = getClient(config);
  const admin = kafka.admin();
  do {
    try {
      const topicMetadata = await admin.fetchTopicMetadata({ topics: [config.get('kafka:bond_topic')] })
      logger.info({ type: 'TOPIC_METADATA', msg: topicMetadata });
      // if (rslt && rslt[1] && rslt[1].metadata) {
      //   if (rslt[1].metadata[config.get('kafka:bond_topic')]) {
      //     logger.info({ type: 'HOST_WAIT_INFO', msg: 'Kafka and topic found' });
          return true;
      //   } else {
      //     logger.info({ type: 'HOST_WAIT_INFO', msg: 'Kafka found' });
      //     return false;
      //   }
      // }
    } catch (err) {
      logger.error({ type: 'HOST_WAIT_ERROR', err });
    }
    await setTimeoutAsync(1000);
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
    client.refreshMetadata([config.get('kafka:bond_topic')], err => {
      client.createTopics(topicsToCreate, (err, data) => {
        if (err) {
          logger.error({err});
          rej(err);
        }
        rslv(data);
      });
    });
  } catch (err) {
    logger.error({ err });
    rej(err);
  }
});

const getAdmin = ({ config, logger }) => new Promise((resolve, reject) => {
  if (admin) return resolve(admin);
  const client = getClient(config);
  admin = new Admin(client);
  admin.on('ready', () => {
    logger.info({ msg: 'admin is ready '});
    client.refreshMetadata([config.get('kafka:bond_topic')], err => {
      logger.info({ msg: 'admin metadata retrieved'});
      if (err) {
        logger.error({ type: 'ADMIN_META_REFRESH', err });
        return reject(err);
      }
      logger.info({ msg: 'returning instance of admin'});
      return resolve(admin);
    });
  })
  admin.on('error', err => {
    logger.error({ type: 'ADMIN_ERROR', err });
    return reject(err);
  })
});

const getConsumer = ({ config, logger }) => new Promise((resolve, reject) => {
  if (consumer) return resolve(consumer);
  const client = getClient(config);
  consumer = new ConsumerGroup(
      {
        groupId: 'ExampleTestGroup',
        kafkaHost: config.get('kafka:url'),
      },
    [config.get('kafka:bond_topic')]
  );
  client.refreshMetadata([config.get('kafka:bond_topic')], err => {
    const offset = new Offset(client);
    if (err) {
      logger.error({ type: "CONSUMER_METADATA_REFRESH", err });
      return reject(null);
    }
    consumer.on('message', )
    consumer.on('error', err => {
      logger.error({ type: "CONSUMER_ERR", err });
      return;
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
    return;
  })
});

module.exports = {
  checkTopicAvailable,
  createTopic,
  getAdmin,
  getConsumer,
  getProducer,
  waitForHostAndTopic,
};
