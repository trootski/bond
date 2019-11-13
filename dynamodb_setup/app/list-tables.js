#!/usr/bin/env node

const logger = require('pino')();
const AWS = require('aws-sdk');
const config = require('nconf');

config.file('./config.json');

logger.info({ code: 'DYNAMO_LIST_START', msg: `Connecting to DynamoDB
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

    logger.info({ code: 'DYNAMO_LIST_INFO', msg: 'Connecting to DynamoDB' });
    const dynamodb = await new AWS.DynamoDB(dynamoDbParams);

    logger.info({ code: 'DYNAMO_LIST_INFO', msg: 'Listing Tables' });
    const { TableNames: allTables  } = await dynamodb.listTables({}).promise();

    logger.info(allTables);

    process.exit(0);
  } catch (e) {
    logger.error({ code: 'DYNAMO_LIST_ERROR', err });
  }
})();
