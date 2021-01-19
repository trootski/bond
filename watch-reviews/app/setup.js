#!/usr/bin/env node

const fetch = require('node-fetch');
const fs = require('fs');
const config = require('nconf');
const logger = require('pino')().child({ app: 'WATCH_REVIEWS' });
const showdown = require('showdown');
const watch = require('glob-watcher');

const converter = new showdown.Converter();

const getReviewHTML = async (fname) => {
  const markdown = fs.readFileSync(
    `${config.get('app:base_fs_path')}/${config.get('app:storage_path')}${fname}`, 'utf8');
  return converter.makeHtml(markdown);
}

config.file(`./config/config.json`);

if (process.env.REVIEW_UPDATES_API_URL) {
  config.set('app:review_updates_api_url', process.env.REVIEW_UPDATES_API_URL);
}

logger.info({
  type: 'START',
  msg: `Starting up...\n\nSettings: ${JSON.stringify(config.get())}`,
});

const filmMeta = require(`${config.get('app:base_fs_path')}/${config.get('app:film_meta_path')}`);

(async () => {
  // Raw chokidar instance
  const watcher = watch(['./storage/reviews/**/*'], { ignoreInitial: false });

  const postMovieToProcess = async reviewFileName => {
    const baseURL = config.get('app:review_updates_api_url');
    const url = `${baseURL}/v1/bond-movie-events/review-updates/enqueue`;
    logger.info({ url });
    const fName = reviewFileName.split('/').slice(-1).pop();
    const metaData = filmMeta.data.find(v => v.review === fName);
    const { order, title }  = metaData;
    const review = await getReviewHTML(fName);
    if (!review) return null;
    const dataToSend = { order, review, title };
    // logger.info({ type: 'SEND_DATA', data: JSON.stringify(dataToSend), url });
    try {
      const rslt = await fetch(url, {
        body: JSON.stringify(dataToSend),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
      });
      logger.info({ type: 'SEND_DATA_RESPONSE', body: (await rslt.text()), status: rslt.status });
    } catch(err) {
      logger.error({ msg: 'SEND_REVIEW_UPDATE_ERR', err });
    }
  };

    watcher.on('change', path => {
      postMovieToProcess(path);
    });

    watcher.on('add', path => {
      postMovieToProcess(path);
    });
})();
