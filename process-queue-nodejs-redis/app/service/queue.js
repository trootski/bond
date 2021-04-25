const { getConsumer, getProducer } = require('../redis');
const { promisify } = require("util");
const { getMovieMetadataDBData } = require('./movie-metadata.js');
const { setBondMovieAPI } = require('./bond-movie-api.js');

const pushBondMovieUpdate = async ({ body, config, logger }) => {
  const producer = getProducer({ config, logger });
  const rpushAsync = promisify(producer.rpush).bind(producer);
  try {
    const result = await rpushAsync(
      config.get('redis:bond_list'),
      JSON.stringify(body)
    );
    logger.debug({ 
      msg: `Sent message: ${JSON.stringify(body)}`, 
      res: result,
    });
    return true;
  } catch (err) {
    logger.error({ type: 'PUSH_MESSAGE_ERROR', err });
    throw err;
  }
};

const setupQueueListener = ({ config, logger }) => {
  const consumer = getConsumer({ config, logger });
  const blpopAsync = promisify(consumer.blpop).bind(consumer);
  const checkQueue = async () => {
    try {
      const bondMovie = await blpopAsync(config.get('redis:bond_list'), 1);
      logger.info({ msg: 'got result: ', bondMovie });

      if (bondMovie) {
        const [listName, listMovie] = bondMovie;
        const getMovieMetadataCtx = getMovieMetadataDBData({ config, logger });
        const setBondMovieAPICtx = setBondMovieAPI({ config, logger });
        const getMessageValue = () => {
          try {
            return JSON.parse(listMovie)
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
      }
    } catch (err) {
      logger.error({ type: 'PULL_MESSAGE_ERROR', err });
    } finally {
      logger.info({ msg: 'Checking queue' });
      setTimeout(checkQueue, 100);
    }
  };
  checkQueue();
};

module.exports = {
  pushBondMovieUpdate,
  setupQueueListener,
};

