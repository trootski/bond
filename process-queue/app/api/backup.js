const fs = require('fs');
const logger = require('pino')().child({ app: 'PROCESS_QUEUE' });
const showdown = require('showdown');
const { getConsumer, waitForHostAndTopic } = require('../kafka/kafka.js');

const converter = new showdown.Converter();

const getReviewHTML = async (fname) => {
  const markdown = fs.readFileSync(`/opt/process_queue/storage/reviews/${fname}`, 'utf8');
  return converter.makeHtml(markdown);
}

const getOMDBData = async ({ config, fname, logger }) => {
  const filmData = require('/opt/process_queue/storage/film-meta.json');
  const filmEntry = filmData.data.find(v => v.review === fname);
  const redisGet = getAsync({ config, logger });
  if (filmEntry) {
    return JSON.parse((await redisGet(filmEntry.title)));
  } else {
    return null;
  }
};

const setup = async (ctx, next) => {
  const { config, logger } = ctx;

  await waitForHostAndTopic({ logger, config });

  const consumer = await getConsumer({ logger, config });
  consumer.on('message', async m => {
    // const fname = (m.value.match(/(storage\/reviews\/)?(.+)$/) || [])[2];

    // if (!fname) return;
    // try {
    //   const OMDBData = await getOMDBData({ config, fname, logger });

    //   if (OMDBData) {
    //     const dynamodb = await getDocumentClient({ config, logger });

    //     const checkItem = await dynamodb.get({
    //       TableName: 'BondMovies',
    //       Key: {
    //         'Director': OMDBData.Director,
    //         'MovieTitle': OMDBData.Title,
    //       },
    //     }).promise();

    //     const dateCreated = (checkItem.Item) ?
    //       checkItem.Item.dateCreated : new Date().toISOString();

    //     const filmEntry = searchMovieMetaObject(config)('review')(fname);
    //     const html = await getReviewHTML(fname);

    //     const dataToPersist = {
    //       ...filmEntry,
    //       ...OMDBData,
    //       ...{
    //        dateCreated: dateCreated,
    //        html,
    //        "MovieTitle": OMDBData.Title,
    //       }
    //     };

    //     const createRecord = await dynamodb.put({
    //       Item: dataToPersist,
    //       ReturnConsumedCapacity: 'TOTAL',
    //       TableName: 'BondMovies',
    //     }).promise();
    //   }
    // } catch (err) {
    //   logger.error({ err });
    // }
  });

  consumer.on('error', err => {
    logger.error({ code: 'CONSUMER_ERROR', err });
  });

  await next();
};

module.exports = setup;
