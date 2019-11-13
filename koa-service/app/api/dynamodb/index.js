const AWS = require('aws-sdk');
const request = require('request');
const fs = require('fs');

const getDynamoDBFilms = async (ctx, next) => {
  const { logger } = ctx;
  const getDynamoDocumentClient = async () => {
    const dynamoDbParams = {
      apiVersion: ctx.config.get('dynamodb:apiVersion'),
      convertEmptyValues: true,
      accessKeyId: ctx.config.get('dynamodb:accessKeyId'),
      secretAccessKey: ctx.config.get('dynamodb:secretAccessKey'),
      endpoint: ctx.config.get('dynamodb:dynamoDBEndpoint'),
      logger,
      region: ctx.config.get('dynamodb:region'),
    };
    try {
      const client = await new AWS.DynamoDB(dynamoDbParams);
      const dynamodb = await new AWS.DynamoDB.DocumentClient({
        params: dynamoDbParams,
        service: client,
        convertEmptyValues: true,
      });
      return dynamodb;
    } catch (err) {
      logger.error({ code: 'FETCH_ERROR', err });
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
    } catch (err) {
      logger.error({ code: 'FETCH_ERROR', err });
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
