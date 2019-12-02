#!/usr/bin/env node

const config = require('nconf');
const fg = require('fast-glob');
const logger = require('pino')().child({ app: 'WATCH_REVIEWS' });
const showdown = require('showdown');
const watch = require('glob-watcher');
const { registerUncaughtErrors } = require('bond-common');

const converter = new showdown.Converter();

const getReviewHTML = async (fname) => {
  const markdown = fs.readFileSync(`/opt/process_queue/storage/reviews/${fname}`, 'utf8');
  return converter.makeHtml(markdown);
}

config.file(`./config/config.json`);

logger.info({
  type: 'START',
  msg: `Starting up...\n\nSettings: ${JSON.stringify(config.get())}`,
});

registerUncaughtErrors({ logger });

(async () => {
  // Raw chokidar instance
  const watcher = watch(['./storage/**/*'], { ignoreInitial: false });

  const postMovieToProcess = async reviewFileName => {
    const url = `${config.get('app:queue_service_url')}/bond-movies-events/review-updates/enqueue/`;
    const rslt = await fetch({
      method: 'PUT',
      url,
    });
    logger.info({ msg: rslt });
  };

    watcher.on('change', path => {
      logger.info({ type: 'PRODUCER_FILE_CHANGE', data: { path } });
      postMovieToProcess(path);
    });

    watcher.on('add', path => {
      logger.info({ type: 'PRODUCER_FILE_ADD', data: { path } });
      postMovieToProcess(path);
    });
})();
