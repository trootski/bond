#!/usr/bin/env node

const logger = require('pino')();
const AWS = require('aws-sdk');
const config = require('nconf');

config.file('./config.json');

logger.info({ code: 'DYNAMO_SETUP_START', msg: `Connecting to DynamoDB
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

    const dynamodb = await new AWS.DynamoDB(dynamoDbParams);

    const { TableNames: allTables  } = await dynamodb.listTables({}).promise();

    if (allTables.includes('BondMovies')) {
      logger.info({ code: 'DYNAMO_SETUP_INFO', msg: 'Dropping old table' });
      await dynamodb.deleteTable({ TableName: 'BondMovies' }).promise();
    }

    logger.info({ code: 'DYNAMO_SETUP_INFO', msg: 'Creating table' });
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

    process.exit(0);
  } catch (err) {
    logger.error({ code: 'DYNAMO_SETUP_ERROR', error: err.message });
  }
})();

