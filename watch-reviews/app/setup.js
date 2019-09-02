#!/usr/bin/env node

const logger = require('pino')();
const config = require('nconf');
const { promisify } = require('util');
const kafka = require('kafka-node');
const { Producer, KeyedMessage } = kafka;
const watch = require('glob-watcher');
const fg = require('fast-glob');

// Raw chokidar instance
const watcher = watch(['./**/*'], { ignoreInitial: false });

// Listen for the 'change' event to get `path`/`stat`
// No async completion available because this is the raw chokidar instance
watcher.on('change', function(path, stat) {
  logger.info({ code: 'PRODUCER_FILE_CHANGE', data: { path, stat } });
  // `path` is the path of the changed file
  // `stat` is an `fs.Stat` object (not always available)
});

// Listen for other events
// No async completion available because this is the raw chokidar instance
watcher.on('add', function(path, stat) {
  // `path` is the path of the changed file
  // `stat` is an `fs.Stat` object (not always available)
});

logger.info('Starting up...');
logger.info(`CACHE_ENV: ${process.env.CACHE_ENV}`);
logger.info(`DIR: ${__dirname}`);

config.file(`./config/config.json`);

if (process.env.CACHE_ENV) {
  config.file(`./config/config.${process.env.CACHE_ENV}.json`);
}
logger.info(`Settings: ${JSON.stringify(config.get())}`);


(async () => {
  const entries = await fg(['/opt/watch_reviews/storage/**/*']);
  logger.info({ code: 'HERE', entries });

  const client = new kafka.KafkaClient({
    kafkaHost: config.get('app:kafka_url'),
  });
  const producer = new Producer(client);
  const km = new KeyedMessage('key', 'message');
  const payloads = [
      { topic: 'BondMoviesToBeProcessed', messages: [km] }
  ];
  producer.on('ready', () => {
    logger.info({ code: 'PRODUCER_READY' });
    producer.send(payloads, (err, data) => {
      if (err) {
        logger.error({ code: 'PRODUCER_SEND', error: err });
        process.exit(1);
      }
      logger.info({ code: 'PRODUCER_SEND', data });
      process.exit(0);
    });
  });

  producer.on('error', err => {
    logger.error({ code: 'PRODUCER_ERROR', error: err });
  });
})();
