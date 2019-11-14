#!/usr/bin/env node

const config = require('nconf');
const logger = require('pino')().child({ app: 'CACHE_SYNC' });
const { setexAsync } = require('./utils/redis.js');

const { getMovieDetailsToCache } = require('./utils/omdb.js');
const registerUncaughtErrors = require('./utils/uncaught-errors.js');

config.file('/opt/cache_sync/config/config.json');

logger.info({
  type: 'CACHE_START',
  msg: `Starting up...\n\nSettings: ${JSON.stringify(config.get())}`,
});

registerUncaughtErrors({ logger });

client.on("error", function (err) {
  logger.error({ err });
  process.exit(0);
});

(async () => {
  try {
    // Get the movie data
    const movieDetailsToCache = await getMovieDetailsToCache();

    // Perform redis sync
    await Promise.all(
      Object.keys(movieDetailsToCache)
        .map(
          title => {
            logger.info({ msg: `Setting cache key ${title}` });
            return setexAsync(
              title,
              config.get('app:cache_tick'),
              JSON.stringify(movieDetailsToCache[title])
            );
          }
        )
    );
    process.exit(0);
  } catch (e) {
    logger.error({ err });
  }
})();
