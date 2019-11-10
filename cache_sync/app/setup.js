#!/usr/bin/env node

const logger = require('pino')();
const { promisify } = require('util');
const config = require('nconf');
const fetch = require('node-fetch');
const redis = require("redis");

logger.info(`Starting up... ${process.env.CACHE_ENV}`);

config.file('/opt/cache_sync/config/config.json');

logger.info(`Settings: ${JSON.stringify(config.get())}`);

const filmMeta = require(config.get('app:film_meta_path'));

const client = redis.createClient({
  host: config.get('app:redis_server_url'),
  port: config.get('app:redis_server_port'),
});
const setexAsync = promisify(client.setex).bind(client);

const getMovieDetails = (title) => {
  const apiKey = config.get('app:omdb_key');
  const omdbURL = `http://www.omdbapi.com/?apikey=${apiKey}&t=${title}`;
  return fetch(omdbURL);
};

client.on("error", function (err) {
    logger.error("Redis Error:  " + err);
});

(async () => {
  try {
    // Fetch movie details from OMDB for each movie title
    const res = await Promise.all(filmMeta.data
      .map(v => v.title)
      .map(getMovieDetails));
    // Resolve the json for each movie if possible as the promise value
    const movieData = await Promise.all(
      res.map(v => (v.status === 200) ? v.json() : Promise.resolve(null)));
    // Create a hash map of the movies to sync with redis
    const movieDetailsToCache = await movieData.reduce((acc, cur) => {
      acc[cur.Title] = cur;
      return acc;
    }, {});
    // Perform redis sync
    const redisRes = await Promise.all(
      Object.keys(movieDetailsToCache)
        .map(
          title => {
            logger.info(`Setting cache key ${title}`);
            return setexAsync(
              title,
              7200,
              JSON.stringify(movieDetailsToCache[title])
            );
          }
        )
    );
    process.exit(0);
  } catch (e) {
    logger.error(e);
  }
})();
