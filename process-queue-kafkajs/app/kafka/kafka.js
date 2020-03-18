let admin, client, consumer, producer;

const { Kafka, logLevel } = require('kafkajs');

const getClient = config => {
  if (client) return client;
  client = new Kafka({
    brokers: [config.get('kafka:url')],
    clientId: config.get('kafka:client_id'),
    logLevel: logLevel.ERROR,
    retry: {
      initialRetryTime: 1000,
      retries: 1000,
    },
  });
  return client;
};

const getAdmin = config => {
  if (admin) return admin;
  const kafka = getClient(config);
  admin = kafka.admin();
  return admin;
};

const getConsumer = config => {
  if (consumer) return consumer;
  const kafka = getClient(config);
  consumer = kafka.consumer({
    groupId: config.get('kafka:consumer_group_name'),
  });
  return consumer;
};

const getProducer = config => {
  if (producer) return producer;
  const kafka = getClient(config);
  producer = kafka.producer();
  return producer;
};

const createTopic = async ({ config, logger }) => new Promise(async (rslv, rej) => {
  let isTopicAvailable;
  try {
    const admin = await getAdmin(config);
    await admin.connect();
    isTopicAvailable = await admin.createTopics({
      topics: [{
        configEntries: [],
        numPartitions: 1,
        replicationFactor: 1,
        topic: config.get('kafka:bond_topic'),
      }],
      // waitForLeaders: true,
    });
  } catch (err) {
    logger.error({ type: 'CREATE_TOPIC_ERROR', err });
    rej(err);
  } finally {
    await admin.disconnect();
  }
  return rslv(isTopicAvailable);
});

module.exports = {
  createTopic,
  getAdmin,
  getConsumer,
  getProducer,
};
