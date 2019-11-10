#!/usr/bin/env node

const logger = require('pino')();
const AWS = require('aws-sdk');
const config = require('nconf');

config.file('./config.json');

logger.info(config.get());

const main = async () => {
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

  logger.info('Scan all rows in table...');
  const allResults = await dynamodb.scan({
    TableName: 'BondMovies'
  }).promise();

  logger.info(allResults);

  return 0;
};

main()
  .then(val => logger.info)
  .catch(err => logger.error);

