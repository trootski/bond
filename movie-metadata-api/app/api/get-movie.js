const { delAsync, getAsync, setAsync } = require('../redis/redis.js');
const { getMovieMetadata: tmdb } = require('../tmdb');

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
    ctx.response.body = cachedData;
  } else {
    // const getMovieMetadata = (config.get('movie_meta_store') === 'tmdb' ? tmdb : omdb)({ config, logger });
    const getMovieMetadata = tmdb({ config, logger });
    const movieMetadata = await getMovieMetadata(movieTitle);
    await setAsyncCtx(movieTitle, JSON.stringify(movieMetadata), 'EX', config.get('app:cache_expiry_timeout'));
    ctx.response.status = 200;
    ctx.response.body = movieMetadata;
  }
  await next();
};

module.exports = getMovie;

