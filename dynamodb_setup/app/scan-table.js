#!/usr/bin/env node

const AWS = require('aws-sdk');
const config = require('nconf');
const logger = require('pino')().child({ app: 'DYNAMODB_SETUP' });
const { getDynamoDBClient } = require('./utils/dynamo.js');

config.file('/opt/dynamodb_setup/config/config.json');

logger.info({
  msg: `Connecting to DynamoDB\n\nSettings: ${JSON.stringify(config.get())}`,
});

(async () => {
  try {
    const dynamodb = await getDynamoDBClient({ config, logger, waitForTable: false });

    logger.info({ msg: 'Scan all rows in table...' });
    const allResults = await dynamodb.scan({
      TableName: 'BondMovies'
    }).promise();

    logger.info({ msg: allResults });

    process.exit(0);
  } catch (err) {
    logger.error({ err });
  }
})();
