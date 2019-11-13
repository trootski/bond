#!/usr/bin/env node

const logger = require('pino')();
const AWS = require('aws-sdk');
const config = require('nconf');

config.file('./config.json');

logger.info({ code: 'DYNAMO_SCAN_START', msg: `Connecting to DynamoDB
Settings: ${JSON.stringify(config.get())}` });

(async () => {
  try {
    const dynamoDbParams = {
      apiVersion: config.get('dynamodb:apiVersion'),
      convertEmptyValues: true,
      accessKeyId: config.get('dynamodb:accessKeyId'),
      secretAccessKey: config.get('dynamodb:secretAccessKey'),
      endpoint: config.get('dynamodb:dynamoDBEndpoint'),
      logger,
      region: config.get('dynamodb:region'),
    };

    logger.info({ code: 'DYNAMO_SCAN_INFO', msg: 'Connecting to DynamoDB...' });
    const dynamodb = await new AWS.DynamoDB(dynamoDbParams);

    logger.info({ code: 'DYNAMO_SCAN_INFO', msg: 'Scan all rows in table...' });
    const allResults = await dynamodb.scan({
      TableName: 'BondMovies'
    }).promise();

    logger.info(allResults);

    process.exit(0);
  } catch (e) {
    logger.error({ code: 'DYNAMO_SCAN_ERROR', err });
  }
})();
