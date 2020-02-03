const fetch = require('node-fetch');
const { delAsync, getAsync, setAsync } = require('../redis/redis.js');
const { deepCopyAndLowerCaseProps } = require('../utils/deepCopyAndLowerCaseProps.js');

const getMovie = async (ctx, next) => {
  const { config, logger } = ctx;
  const getAsyncCtx = getAsync({ config, logger });
  const setAsyncCtx = setAsync({ config, logger });
  const delAsyncCtx = delAsync({ config, logger });
  const movieTitle = ctx.params.title;

  // Get the movie data
  const getCacheJSON = async key => {
    try {
      const cachedDataStr = await getAsyncCtx(key);
      logger.info({ msg: `Cached data: '${cachedDataStr}'` })
      return JSON.parse(cachedDataStr);
    } catch (e) {
      logger.info({ msg: `Error parsing key ("${key}") cached value: '${cachedDataStr}'` })
      await delAsyncCtx(key);
      return null;
    }
  };
  const cachedData = await getCacheJSON(movieTitle);
  if (cachedData) {
    logger.info({ msg: `Cache data receieved for ${movieTitle}.`, data: cachedData })
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

