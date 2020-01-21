const { getDocumentClient } = require('../db/dynamo.js');

const putMovie = async (ctx, next) => {
  const { config, logger } = ctx;
  const movieTitle = ctx.params.title;

  const dynamodb = await getDocumentClient({ config, logger, waitForTable: false });

  logger.info({ msg: 'PUT /v1/bond-movies/:title' });

  const setPayload = { ...ctx.request.body, title: movieTitle };

  const results = await dynamodb.put({
    Item: setPayload,
    ReturnConsumedCapacity: 'TOTAL',
    TableName: config.get('dynamodb:tableName'),
  }).promise();
  ctx.response.status = 204;
  ctx.response.body = '';
  logger.info({ msg: `Got results for put`, results });

  await next();
};

module.exports = putMovie;

