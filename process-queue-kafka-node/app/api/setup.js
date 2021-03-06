const fs = require('fs');
const logger = require('pino')().child({ app: 'PROCESS_QUEUE' });
const showdown = require('showdown');
const { createTopic, getConsumer, waitForHostAndTopic } = require('../kafka/kafka.js');
const { getOMDBData } = require('../utils/omdb.js');
const { setBondMovieAPI } = require('../utils/bond-movie-api.js');

const setup = async (ctx, next) => {
  let kafkaConsumer;
  const { config, logger } = ctx;
  try {
    const isTopicAvailable = await waitForHostAndTopic({ logger, config });

    if (isTopicAvailable) {
      logger.info({ msg: 'Topic already exists' });
    } else {
      logger.info({ msg: `Creating topic: ${config.get('kafka:bond_topic')}` });
      await createTopic({ config, logger, topicName: config.get('kafka:bond_topic') });
    }
    kafkaConsumer = await getConsumer(({ config, logger }));
    kafkaConsumer.on('message', async message => {
      const getOMDBDataCtx = getOMDBData({ config, logger });
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
      const omdbData = await getOMDBDataCtx(messageValue.title);

      const movieData = { ...messageValue, ...omdbData };

      logger.info({ type: 'CONSUMER_RECEIVE', msg: `Setting bond movie '${movieData.title}' info: ${JSON.stringify(movieData)}` });
      try {
        await setBondMovieAPICtx(movieData);
      } catch (err) {
        logger.error({ type: 'CONSUMER_PUT_MOVIE', err });
      }
    });
  } catch (err) {
    logger.error({ type: 'PROCESS_QUEUE_SETUP', err });
  }
  await next();
};

module.exports = setup;
