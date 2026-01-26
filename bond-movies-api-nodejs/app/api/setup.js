const { ListTablesCommand, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { getDynamoDBClient } = require('../db/dynamo.js');

const setup = async (ctx, next) => {
  const { config, logger } = ctx;
  logger.info({ msg: 'Setting up dynamoDB table' });
  const dynamodb = await getDynamoDBClient({ config, logger, waitForTable: false });

  const { TableNames: allTables } = await dynamodb.send(new ListTablesCommand({}));

  if (!allTables.includes(config.get('dynamodb:tableName'))) {
    logger.info({ msg: 'Creating table' });
    await dynamodb.send(new CreateTableCommand({
      TableName: config.get('dynamodb:tableName'),
      AttributeDefinitions: [
        {
          AttributeName: 'catalog_order',
          AttributeType: 'N',
        },
        {
          AttributeName: 'title',
          AttributeType: 'S',
        },
        {
          AttributeName: 'movie_type',
          AttributeType: 'S',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'SortByOrder',
          KeySchema: [
            {
              AttributeName: 'movie_type',
              KeyType: 'HASH'
            },
            {
              AttributeName: 'catalog_order',
              KeyType: 'RANGE'
            }
          ],
          Projection: {
            ProjectionType: 'ALL'
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      ],
      KeySchema: [
        {
          AttributeName: 'title',
          KeyType: 'HASH',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    }));
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
