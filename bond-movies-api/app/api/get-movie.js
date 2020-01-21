const { getDocumentClient } = require('../db/dynamo.js');

const getMovie = async (ctx, next) => {
  const { config, logger } = ctx;
  const movieTitle = ctx.params.title;

  const dynamodb = await getDocumentClient({ config, logger, waitForTable: false });

  logger.info({ msg: 'GET /v1/bond-movies/:title', movieTitle });

  try {
    const results = await dynamodb.get({
      TableName: config.get('dynamodb:tableName'),
      Key: {
        'title': movieTitle,
      },
    }).promise();
    ctx.response.status = 200;
    const { Item } = results;
    ctx.response.body = { ok: true, data: Item };
  } catch (err) {
    logger.error({ err });
    ctx.response.status = 500;
    ctx.response.body = { code: 'err' };
  }
  await next();
};

module.exports = getMovie;

