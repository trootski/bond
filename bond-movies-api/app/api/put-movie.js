const { getDocumentClient } = require('../db/dynamo.js');

const putMovie = async (ctx, next) => {
  const {
    params: { title: movieTitle },
    request: { body: setPayload },
    config,
    logger,
  } = ctx;

  logger.info({ type: 'ingress', endpoint: 'PUT /v1/bond-movies/:title', movieTitle, setPayload });

  const dynamodb = await getDocumentClient({ config, logger, waitForTable: false });

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

