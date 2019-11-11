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

  const checkItem = await dynamodb.getItem({
    TableName: 'BondMovies',
    Key: {
      "Director": {
        S: "Martin Campbell",
       },
      "MovieTitle": {
        S: "Casino Royale",
       }
    },
  }).promise();
  logger.info({ code: 'CONSUMER_INFO', checkItem });
  const dateCreated = (checkItem.Item) ? checkItem.Item.dateCreated : new Date().toISOString();
  const setItem = await dynamodb.putItem({
    Item: {
      MovieTitle: "Casino Royale",
      Director: "Martin Campbell",
      dateCreated,
    },
    TableName: 'BondMovies',
  });
  logger.info({ code: 'CONSUMER_INFO', setItem });
})();
