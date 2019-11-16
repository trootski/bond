#!/usr/bin/env node

const config = require('nconf');
const kafka = require('kafka-node');
const { getProducer, waitForHostAndTopic } = require('./utils/kafka.js');
const logger = require('pino')().child({ app: 'CACHE_SYNC' });
const { getsetAsync } = require('./utils/redis.js');

const { getMovieDetailsToCache, searchMovieMetaObject } = require('./utils/omdb.js');
const registerUncaughtErrors = require('./utils/uncaught-errors.js');

const { KeyedMessage } = kafka;

config.file('/opt/cache_sync/config/config.json');

config.set('app:film_meta_path', `/opt/cache_sync/${config.get('app:film_meta_path')}`);

logger.info({
  type: 'CACHE_START',
  msg: `Starting up...\n\nSettings: ${JSON.stringify(config.get())}`,
});

const getset = getsetAsync({ config, logger });

registerUncaughtErrors({ logger });

(async () => {
  try {
    await waitForHostAndTopic({ config, logger });

    producer = await getProducer({ config });
    producer.on('ready', async () => {
      logger.info({ msg: 'Kafka ready to receive messages' })
      // Get the movie data
      const movieDetailsToCache = await getMovieDetailsToCache({ config, logger });

      logger.info({ msg: `Caching following movies: ${movieDetailsToCache}` })
      // Perform redis sync
      const oldvalues = await Promise.all(Object.keys(movieDetailsToCache).map(title => {
        return getset(
          title,
          JSON.stringify(movieDetailsToCache[title])
        );
      }));

      const searchMetaForTitle = searchMovieMetaObject(config)('title');
      const updated = oldvalues
        .filter(v => !!v)
        .map(JSON.parse)
        .filter(v => v !== movieDetailsToCache[v.Title])
        .map(v => v.Title)
        .map(searchMetaForTitle)
        .filter(v => !!v)
        .map(v => v.review);

      const postQueueMessage = reviewFileName => new Promise((rslv, rej) => {
        const km = new KeyedMessage('reviewFileName', reviewFileName);
        const payloads = [
            { topic: 'BondMoviesToBeProcessed', messages: [km] }
        ];
        producer.send(payloads, (err, data) => {
          if (err) {
            logger.error({ err });
            rej(err);
          }
          rslv(data);
        });
      });
      await Promise.all(updated.map(postQueueMessage));

      process.exit(0);
    });
  } catch (err) {
    logger.error({ err });
  }
})();
