const { createTopic, getConsumer, getProducer } = require('../kafka/kafka.js');
const { getMovieMetadataDBData } = require('./movie-metadata.js');
const { setBondMovieAPI } = require('./bond-movie-api.js');

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
      messages: [{
        key: 'reviewData',
        value: JSON.stringify(body),
      }],
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
  try {
    const consumer = getConsumer(config);
    await consumer.connect();
    await consumer.subscribe({
      topic: config.get('kafka:bond_topic'),
      // fromBeginning: true,
    });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const getMovieMetadataCtx = getMovieMetadataDBData({ config, logger });
        const setBondMovieAPICtx = setBondMovieAPI({ config, logger });
        const getMessageValue = () => {
          try {
            return JSON.parse(message.value)
          } catch(err) {
            logger.error({ type: 'CONSUMER_MESSAGE_JSON', err });
            return null;
          }
        };
        const messageValue = getMessageValue();
        const movieMetadata = await getMovieMetadataCtx(messageValue.title);

        const movieData = { ...messageValue, movie_type: 'movie', ...movieMetadata };

        logger.info({ type: 'CONSUMER_RECEIVE', msg: `Setting bond movie '${movieData.title}'` });
        try {
          await setBondMovieAPICtx(movieData);
        } catch (err) {
          logger.error({ type: 'CONSUMER_PUT_MOVIE', err });
        }
      },
    });
  } catch (err) {
    logger.error({ type: 'QUEUE_LISTENER_ERROR', err })
  }
};


module.exports = {
  connectAndCreateTopic,
  pushBondMovieUpdate,
  startQueueListener,
};
