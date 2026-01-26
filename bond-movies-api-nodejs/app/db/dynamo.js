const { DynamoDBClient, DescribeTableCommand, ListTablesCommand, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { promisify } = require('util');

const setTimeoutAsync = promisify(setTimeout);

const checkDescribeTable = async ({ dynamodb, logger }) => {
  const command = new DescribeTableCommand({ TableName: 'BondMovies' });
  const movieTable = await dynamodb.send(command);
  return movieTable;
};

const checkListTables = async ({ dynamodb, logger }) => {
  const command = new ListTablesCommand({});
  await dynamodb.send(command);
};

const getDocumentClient = async ({ config, logger, waitForTable = true }) => {
  do {
    try {
      const dynamodb = new DynamoDBClient({
        endpoint: config.get('dynamodb:dynamoDBEndpoint'),
        region: config.get('dynamodb:region'),
        credentials: {
          accessKeyId: config.get('dynamodb:accessKeyId'),
          secretAccessKey: config.get('dynamodb:secretAccessKey'),
        },
      });

      const documentClient = DynamoDBDocumentClient.from(dynamodb, {
        marshallOptions: {
          convertEmptyValues: true,
          removeUndefinedValues: true,
        },
      });

      if (waitForTable) {
        await checkDescribeTable({ dynamodb, logger });
      } else {
        await checkListTables({ dynamodb, logger });
      }
      return documentClient;
    } catch (err) {
      logger.error({ msg: 'HOST_WAIT_INFO', err });
      await setTimeoutAsync(config.get('app:dbCheckTimeout'));
    }
  } while (true);
};

const getDynamoDBClient = async ({ config, logger, waitForTable = true }) => {
  do {
    try {
      const dynamodb = new DynamoDBClient({
        endpoint: config.get('dynamodb:dynamoDBEndpoint'),
        region: config.get('dynamodb:region'),
        credentials: {
          accessKeyId: config.get('dynamodb:accessKeyId'),
          secretAccessKey: config.get('dynamodb:secretAccessKey'),
        },
      });

      if (waitForTable) {
        await checkDescribeTable({ dynamodb, logger });
      } else {
        await checkListTables({ dynamodb, logger });
      }
      return dynamodb;
    } catch (err) {
      logger.error({ msg: 'HOST_WAIT_INFO', err });
      await setTimeoutAsync(1000);
    }
  } while (true);
};

module.exports = {
  getDynamoDBClient,
  getDocumentClient,
};
