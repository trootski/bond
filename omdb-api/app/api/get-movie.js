const fetch = require('node-fetch');
const { delAsync, getAsync, setAsync } = require('../redis/redis.js');
const { deepCopyAndLowerCaseProps } = require('../utils/deepCopyAndLowerCaseProps.js');

const getMovie = async (ctx, next) => {
  const { config, logger } = ctx;
  const setAsyncCtx = setAsync({ config, logger });
  const delAsyncCtx = delAsync({ config, logger });
  const movieTitle = ctx.params.title;

  // Get the movie data
  const cachedDataStr = await getAsync({ config, logger })(movieTitle);
  const getCacheJSON = async v => {
    try {
      return JSON.parse(cachedData);
    } catch (e) {
      logger.info({ msg: `Error parsing cached value` })
      await delAsyncCtx(movieTitle);
      return null;
    }
  };
  const cachedData = getCacheJSON(cachedDataStr);
  if (cachedData) {
    logger.info({ msg: `Cache data receieved for ${movieTitle}.` })
    ctx.response.status = 200;
    ctx.response.body = { ok: true, data: cachedData };
  } else {
    logger.info({ msg: `Getting live data for ${movieTitle}.` })
    const apiKey = config.get('omdb:key');
    const omdbURL = `http://www.omdbapi.com/?apikey=${apiKey}&t=${movieTitle}`;
    const results = await fetch(omdbURL);
    const resultJson = await results.json();
    const resultsLowerCaseProps = deepCopyAndLowerCaseProps(resultJson);
    await setAsyncCtx(movieTitle, JSON.stringify(resultsLowerCaseProps), 'EX', config.get('app:cache_expiry_timeout'));
    ctx.response.status = 200;
    ctx.response.body = { ok: true, data: resultsLowerCaseProps };
  }
  await next();
};

module.exports = getMovie;

