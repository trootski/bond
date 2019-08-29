#!/usr/bin/env node

const logger = require('pino')();
const config = require('nconf');
const { promisify } = require('util');
const kafka = require('kafka-node');

logger.info('Starting up...');
logger.info(`CACHE_ENV: ${process.env.CACHE_ENV}`);
logger.info(`Current DIR: ${__dirname}`);

config.file(`${__dirname}/config/config.json`);

if (process.env.CACHE_ENV) {
  config.file(`./config/config.${process.env.CACHE_ENV}.json`);
}
logger.info(`Settings: ${JSON.stringify(config.get())}`);

const client = new kafka.KafkaClient({
  kafkaHost: config.get('app:kafka_url'),
});
const admin = new kafka.Admin(client);
const listTopicsAsync = promisify(admin.listTopics).bind(admin);
const createTopicsAsync = promisify(client.createTopics).bind(client);

const listTopics = async () => {
  logger.info('Listing the topics');
  try {
    const topicList = await listTopicsAsync();
    logger.info({ code: 'KAFKA_LIST_TOPICS', data: topicList });
    return topicList;
  } catch (e) {
    logger.error({ error: e, code: 'KAFKA_LIST_TOPICS'});
    process.exit(0);
  }
};

const createTopic = async topic => {
  logger.info('Creating the topic');
  const topicsToCreate = [{
    topic,
    partitions: 1,
    replicationFactor: 1
  }];
   
  try {
    const topicMetadata = await createTopicsAsync(topicsToCreate);
    logger.info({ data: topicMetadata, code: 'KAFKA_CREATE_TOPIC' });
  } catch (e) {
    logger.error({ error: e, code: 'KAFKA_CREATE_TOPIC' });
    process.exit(0);
  }
};

(async () => {
  const topics = await listTopics();
  const topicName = 'BondMoviesToBeProcessed';
  const matches = topics
    .filter(v => v.metadata !== undefined)
    .map(v => v.metadata)
    .filter(v => v[topicName] !== undefined);
  logger.info({ code: 'KAFKA_CREATE_TOPIC', msg: 'Topic already exists' });

  if (matches.length === 0) {
    await createTopic(topicName);
    await listTopics();
  }

  process.exit(0);
})();
