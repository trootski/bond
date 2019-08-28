#!/usr/bin/env node

'use strict'

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

  logger.info('Listing Tables...');
  const { TableNames: allTables  } = await dynamodb.listTables({}).promise();

  if (allTables.includes('BondMovies')) {
    logger.info('Dropping old tables...');
    await dynamodb.deleteTable({ TableName: 'BondMovies' }).promise();
  }

  logger.info('Creating BondMovies tables...');
  const createTabelRes = await dynamodb.createTable({
    TableName: 'BondMovies',
    AttributeDefinitions: [
      {
        AttributeName: 'Director',
        AttributeType: 'S',
      },
      {
        AttributeName: 'MovieTitle',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'Director',
        KeyType: 'HASH',
      },
      {
        AttributeName: 'MovieTitle',
        KeyType: 'RANGE',
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  }).promise();

  const p = await dynamodb.listTables({}).promise();
  logger.info(p);

  return 0;
};

main()
  .then(val => logger.info)
  .catch(err => logger.error);

