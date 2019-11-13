const kafka = require('kafka-node');
const { promisify } = require('util');

const { Consumer, Offset } = kafka;

const setTimeoutAsync = promisify(setTimeout);

const handleErr = logger => rej => err => {
  logger.error({ code: 'ADMIN_ERROR', error: err.message });
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
      if (rslt && rslt[1] && rslt[1].metadata && rslt[1].metadata['BondMoviesToBeProcessed']) {
        return rslt;
      }
      logger.info({ code: 'HOST_WAIT_INFO', msg: 'Kafka topic not found, retrying...', rslt });
      await setTimeoutAsync(1000);
    } catch (e) {
      logger.error({ code: 'HOST_WAIT_ERROR', error: e.message });
    }
  } while(true);
};
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

module.exports = {
  checkTopicAvailable,
  getConsumer,
  waitForHostAndTopic,
};
