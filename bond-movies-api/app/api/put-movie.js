const { getDocumentClient } = require('../utils/dynamo.js');

const putMovie = async (ctx, next) => {
  const { config, logger } = ctx;
  const movieTitle = ctx.query.title;

  const dynamodb = await getDocumentClient({ config, logger, waitForTable: false });

  logger.info({ msg: 'PUT /v1/bond-movies' });

  try {
    const results = await dynamodb.put({
      Item: ctx.request.body,
      ReturnConsumedCapacity: 'TOTAL',
      TableName: config.get('dynamodb:tableName'),
    }).promise();
    ctx.response.status = 204;
    ctx.response.body = '';
    logger.info({ msg: `Got results for put`, results });
  } catch (err) {
    logger.error({ err });
    ctx.response.status = 500;
    ctx.response.body = { code: 'err' };
  }
  await next();
};

module.exports = putMovie;
