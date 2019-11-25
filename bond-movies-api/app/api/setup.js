const { getDynamoDBClient } = require('../db/dynamo.js');

const setup = async (ctx, next) => {
  const { config, logger } = ctx;
  logger.info({ msg: 'Setting up dynamoDB table' });
  const dynamodb = await getDynamoDBClient({ config, logger, waitForTable: false });

  const { TableNames: allTables  } = await dynamodb.listTables({}).promise();

  if (!allTables.includes(config.get('dynamodb:tableName'))) {
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
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    }).promise();
    logger.info({ msg: 'Table created' });
  } else {
    logger.info({ msg: 'Table exists, skipping' });
  }

  if (ctx && ctx.response) {
    ctx.response.status = 204;
    ctx.response.body = '';
  }
};

module.exports = setup;

