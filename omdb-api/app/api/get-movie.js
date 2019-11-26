const fetch = require('node-fetch');
const { getAsync, setAsync } = require('../redis/redis.js');

const getMovie = async (ctx, next) => {
  const { config, logger } = ctx;
  const movieTitle = ctx.params.title;

  // Get the movie data
  const cachedData = await getAsync({ config, logger })(movieTitle);


  if (cachedData) {
    logger.info({ msg: `Cache data receieved for ${movieTitle}.` })
    ctx.response.status = 200;
    ctx.response.body = { ok: true, data: JSON.parse(cachedData) };
  } else {
    logger.info({ msg: `Getting live data for ${movieTitle}.` })
    const apiKey = config.get('omdb:key');
    const omdbURL = `http://www.omdbapi.com/?apikey=${apiKey}&t=${movieTitle}`;
    const results = await fetch(omdbURL);
    const resultJson = await results.json();
    await setAsync({ config, logger })(movieTitle, JSON.stringify(resultJson), 'EX', config.get('app:cache_expiry_timeout'));
    ctx.response.status = 200;
    ctx.response.body = { ok: true, data: resultJson };
  }
  await next();
};

module.exports = getMovie;

