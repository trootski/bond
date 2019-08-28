const AWS = require('aws-sdk');
const request = require('request');
const fs = require('fs');
const config = require('../../config.js');

const getDynamoDBFilms = async (ctx, next) => {
  const { logger } = ctx;
  const getDynamoDocumentClient = async () => {
    const dynamoDbParams = {
      apiVersion: config.get('dynamodb:apiVersion'),
      convertEmptyValues: true,
      accessKeyId: config.get('dynamodb:accessKeyId'),
      secretAccessKey: config.get('dynamodb:secretAccessKey'),
      endpoint: config.get('dynamodb:dynamoDBEndpoint'),
      logger,
      region: config.get('dynamodb:region'),
    };
    try {
      const documentClient = await new AWS.DynamoDB.DocumentClient(dynamoDbParams)
      return documentClient;
    } catch (e) {
      logger.error({ code: 'FETCH_ERROR', error: e });
      ctx.response.status = 500;
      ctx.response.body = { code: 'FETCH_ERROR', message: 'Connection error' };
      return null;
    }
  };

  const dynamodb = await getDynamoDocumentClient();

  await next();

  if (dynamodb !== null) {
    try {
      const res = await dynamodb.scan({
        TableName: 'BondMovies',
      }).promise();
      logger.info({ results: res });
      const { Items } = res;
      ctx.response.status = 200;
      ctx.response.body = { ok: true, data: Items };
    } catch (e) {
      logger.error({ code: 'FETCH_ERROR', error: e });
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
  }
};

module.exports = {
  getDynamoDBFilms,
};
