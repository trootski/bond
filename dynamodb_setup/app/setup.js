#!/usr/bin/env node

const config = require('nconf');
const logger = require('pino')().child({ app: 'DYNAMODB_SETUP' });
const { getDynamoDBClient } = require('./utils/dynamo.js');

config.file('/opt/dynamodb_setup/config/config.json');

logger.info({
  type: 'START',
  msg: `Connecting to DynamoDB\n\nSettings: ${JSON.stringify(config.get())}`,
});

(async () => {
  try {
    const dynamodb = await getDynamoDBClient({ config, logger, waitForTable: false });

    const { TableNames: allTables  } = await dynamodb.listTables({}).promise();

    if (allTables.includes(config.get('dynamodb:tableName'))) {
      logger.info({ msg: 'Dropping old table' });
      await dynamodb.deleteTable({ TableName: config.get('dynamodb:tableName') }).promise();
    }

    logger.info({ msg: 'Creating table' });
    await dynamodb.createTable({
      TableName: config.get('dynamodb:tableName'),
      AttributeDefinitions: [
        {
          AttributeName: 'MovieTitle',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'MovieTitle',
          KeyType: 'HASH',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'DateCreatedIndex',
          KeySchema: [
            {
              AttributeName: 'MovieTitle',
              KeyType: 'HASH'
            },
            {
              AttributeName: 'dateCreated',
              KeyType: 'RANGE'
            }
          ],
          Projection: {
            ProjectionType: 'KEYS_ONLY'
          },
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    }).promise();

    process.exit(0);
  } catch (err) {
    logger.error({ msg: 'OUTER', err });
  }
})();

