#!/usr/bin/env node

const logger = require('pino')();
const { promisify } = require('util');
const config = require('nconf');
const fetch = require('node-fetch');
const filmMeta = require('../storage/film-meta.json');
const redis = require("redis"),
      client = redis.createClient({
        host: config.get('app:redis_server_url'),
        port: config.get('app:redis_server_port'),
      });
const setexAsync = promisify(client.setex).bind(client);

config.file('./config.json');

const getMovieDetails = (title) => {
  const apiKey = config.get('app:omdb_key');
  const omdbURL = `http://www.omdbapi.com/?apikey=${apiKey}&t=${title}`;
  return fetch(omdbURL);
};

client.on("error", function (err) {
    info.error("Redis Error:  " + err);
});

(async () => {
  try {
    const res = await Promise.all(
      filmMeta.data
        .map(v => v.title)
        .map(getMovieDetails)

    );
    const movieData = await Promise.all(
      res.map(v => (v.status === 200) ? v.json() : Promise.resolve(null))
    );
    const movieDetailsToCache = await movieData.reduce((acc, cur) => {
      acc[cur.Title] = cur;
      return acc;
    }, {});
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
