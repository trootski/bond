const { createTopic, getConsumer, getProducer } = require('../kafka/kafka.js');
const { getOMDBData } = require('./omdb.js');
const { setBondMovieAPI } = require('./bond-movie-api.js');
const { CompressionTypes } = require('kafkajs');

const connectAndCreateTopic = async ({ config, logger }) => {
  do {
    try {
      const isTopicAvailable = await createTopic({config, logger});
      if (isTopicAvailable) {
        logger.info({msg: 'Topic already exists'});
      } else {
        logger.info({msg: `Created topic: ${config.get('kafka:bond_topic')}`});
      }
      break;
    } catch (err) {
      logger.error({ type: 'INITIAL_CONNECTION', err });
      throw err;
    }
  } while (true);
};

const pushBondMovieUpdate = async ({ body, config, logger }) => {
  const producer = getProducer(config);
  try {
    await producer.connect();
    await producer.send({
      topic: config.get('kafka:bond_topic'),
      // compression: CompressionTypes.GZIP,
      messages: [{
        key: 'reviewData',
        value: JSON.stringify(body),
      }],
      // partition: 0,
    });
    logger.info({ msg: `Sent message: ${JSON.stringify(body)}` });
    return true;
  } catch (err) {
    logger.error({ type: 'PUSH_MESSAGE_ERROR', err });
    throw err;
  } finally {
    await producer.disconnect();
  }
};

const startQueueListener = async ({ config, logger }) => {
  const consumer = getConsumer(config);
  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: config.get('kafka:bond_topic'),
      fromBeginning: true,
    });
    logger.info({ msg: 'Waiting for messages' });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const getOMDBDataCtx = getOMDBData({ config, logger });
        const setBondMovieAPICtx = setBondMovieAPI({ config, logger });
        logger.info({ msg: JSON.stringify(message.value) });
        const getMessageValue = () => {
          try {
            return JSON.parse(message.value)
          } catch(err) {
            logger.error({ type: 'CONSUMER_MESSAGE_JSON', err });
            return null;
          }
        };
        const messageValue = getMessageValue();
        const omdbData = await getOMDBDataCtx(messageValue.title);

        const movieData = { ...messageValue, ...omdbData };

        logger.info({ type: 'CONSUMER_RECEIVE', msg: `Setting bond movie '${movieData.title}' info: ${JSON.stringify(movieData)}` });
        try {
          await setBondMovieAPICtx(movieData);
        } catch (err) {
          logger.error({ type: 'CONSUMER_PUT_MOVIE', err });
        }
        console.log({
          key: message.key.toString(),
          value: message.value.toString(),
          headers: message.headers,
        })
      },
    })
  } catch (err) {
    logger.error({ type: 'QUEUE_LISTENER_ERROR', err })
  } finally {
    consumer.disconnect();
  }
};


module.exports = {
  connectAndCreateTopic,
  pushBondMovieUpdate,
  startQueueListener,
};
