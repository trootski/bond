const AWS = require('aws-sdk');
const request = require('request');
const fs = require('fs');
const { getDocumentClient } = require('../db/dynamo.js');

const getAllMovies = async (ctx, next) => {
  const { config, logger } = ctx;

  const dynamodb = await getDocumentClient({ config, logger, waitForTable: false });

  try {
    const res = await dynamodb.scan({
      IndexName: 'SortByOrder',
      TableName: 'BondMovies',
    }).promise();

    logger.info({ msg: 'GET /v1/bond-movies' });
    logger.info({ res });

    const { Items } = res;
    logger.info({ Items });
    const strippedOfMovieType = Items.map(v => {
      const { movieType, ...allElse } = v;
      return allElse;
    });

    ctx.response.status = 200;
    ctx.response.body = strippedOfMovieType;
  } catch (err) {
      logger.error({ code: "FETCHING_ALL_MOVIES", err });
  }

  await next();
};

module.exports = getAllMovies;

