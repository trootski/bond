#!/usr/bin/env node

const AWS = require('aws-sdk');
const config = require('nconf');
const logger = require('pino')();
const { promisify } = require('util');

config.file(`./config/config.json`);

(async () => {
  const dynamoDbParams = {
    apiVersion: config.get('dynamodb:apiVersion'),
    convertEmptyValues: true,
    accessKeyId: config.get('dynamodb:accessKeyId'),
    secretAccessKey: config.get('dynamodb:secretAccessKey'),
    endpoint: config.get('dynamodb:dynamoDBEndpoint'),
    logger,
    region: config.get('dynamodb:region'),
  };

  logger.info('Connecting to DynamoDB...');
  const dynamodb = await new AWS.DynamoDB(dynamoDbParams);

  const dateCreated = new Date().toISOString();
  try {
    const setItem = await dynamodb.putItem({
      Item: {
        MovieTitle: { S: "Casino Royale" },
        Director: { S: "Martin Campbell" },
      },
      TableName: 'BondMovies',
    }).promise();
    logger.info({ code: 'CONSUMER_INFO', setItem });
  } catch (e) {
    logger.info(e);
  }
})();