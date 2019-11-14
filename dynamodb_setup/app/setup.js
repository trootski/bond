#!/usr/bin/env node

const config = require('nconf');
const logger = require('pino')().child({ app: 'DYNAMODB_SETUP' });
const { getDynamoDBClient } = require('./utils/dynamo.js');

config.file('./config.json');

logger.info({
  type: 'START',
  msg: `Connecting to DynamoDB\n\nSettings: ${JSON.stringify(config.get())}`,
});

(async () => {
  try {
    const dynamodb = await getDynamoDBClient({ config, logger, waitForTable: false });

    const { TableNames: allTables  } = await dynamodb.listTables({}).promise();

    if (allTables.includes('BondMovies')) {
      logger.info({ msg: 'Dropping old table' });
      await dynamodb.deleteTable({ TableName: 'BondMovies' }).promise();
    }

    logger.info({ msg: 'Creating table' });
    await dynamodb.createTable({
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
    logger.error({ msg: 'OUTER', err });
  }
})();

