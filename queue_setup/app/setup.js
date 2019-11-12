#!/usr/bin/env node

const logger = require('pino')();
const config = require('nconf');
const { promisify } = require('util');
const kafka = require('kafka-node');

const setTimeoutAsync = promisify(setTimeout);

config.file(`/opt/queue_setup/config/config.json`);

const topicName = 'BondMoviesToBeProcessed';

logger.info({ code: 'QUEUE_SETUP_START', msg: `Connecting to Kafka
Settings: ${JSON.stringify(config.get())}` });

process.on('uncaughtException', function (err) {
  logger.error({ code: 'QUEUE_SETUP_ERROR', error: err.message });
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ code: 'QUEUE_SETUP_ERROR', error: (reason.stack || reason) });
  process.exit(0);
});

const handleErr = rej => err => {
  logger.error({ code: 'ADMIN_ERROR', error: err.message });
  rej(err);
};

(async () => {
  try {
    const client = new kafka.KafkaClient({
      kafkaHost: config.get('kafka:url'),
      connectTimeout: 2000,
      requestTimeout: 2000,
    });
    const admin = new kafka.Admin(client);
    
    const listTopicsAsync = promisify(admin.listTopics).bind(admin);
    const createTopicsAsync = promisify(client.createTopics).bind(client);

    const checkTopicAvailable = () => new Promise(async (rslv, rej) => {
      try {
        const handleRejection = handleErr(rej); 
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
    const waitForHost = async () => {
      do {
        try {
          const rslt = await checkTopicAvailable();
          if (rslt && rslt[1] && rslt[1].metadata) {
            return rslt;
          }
          logger.info({ code: 'HOST_WAIT_INFO', msg: 'Kafka topic not found, retrying...', rslt });
          await setTimeoutAsync(1000);
        } catch (e) {
          logger.error({ code: 'HOST_WAIT_ERROR', error: e.message });
        }
      } while(true);
    }
    const topics = await waitForHost();
    const matches = topics
      .filter(v => v.metadata !== undefined)
      .map(v => v.metadata)
      .filter(v => v[topicName] !== undefined);

    if (matches.length === 0) {
      logger.info({ code: 'QUEUE_SETUP_INFO', msg: 'Creating Topic' });
      await createTopic(topicName);
    } else {
      logger.info({ code: 'QUEUE_SETUP_INFO', msg: 'Topic already exists' });
    }

    process.exit(0);
  } catch (err) {
    logger.error({ code: 'QUEUE_SETUP_ERROR', error: err.message });
  }
})();
