const AWS = require('aws-sdk');
const request = require('request');
const fs = require('fs');
const { getDocumentClient } = require('../utils/dynamo.js');

const getAllMovies = async (ctx, next) => {
  const { config, logger } = ctx;

  const dynamodb = await getDocumentClient({ config, logger, waitForTable: false });

  try {
    const res = await dynamodb.scan({
      TableName: 'BondMovies',
    }).promise();

    logger.info({ msg: 'GET /v1/bond-movies' });

    const { Items } = res;

    ctx.response.status = 200;
    ctx.response.body = { ok: true, data: Items };
  } catch (err) {
    logger.error({ err });
    switch (e.code) {
      case 'ResourceNotFoundException':
        ctx.response.status = 404;
        ctx.response.body = { code: 'FETCH_ERROR', message: 'Table missing' };
        break;
      default:
        ctx.response.status = 500;
        ctx.response.body = { code: 'FETCH_ERROR', message: 'General error' };
    }
  }

  await next();
};

module.exports = getAllMovies;
