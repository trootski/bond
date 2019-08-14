#!/usr/bin/env node

'use strict'

const logger = require('pino')();
const AWS = require('aws-sdk');
const config = require('nconf');

config.file('./config.json');

logger.info(config.get());

const main = async () => {
  const dynamoDbParams = {
    apiVersion: config.get('apiVersion'),
    convertEmptyValues: true,
    accessKeyId: config.get('accessKeyId'),
    secretAccessKey: config.get('secretAccessKey'),
    endpoint: config.get('dynamoDBEndpoint'),
    logger,
    region: config.get('region'),
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
  return await dynamodb.createTable({
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
};

main().then(
  val => console.log,
  err => console.error
);

