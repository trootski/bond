const AWS = require('aws-sdk');
const { promisify } = require('util');

const setTimeoutAsync = promisify(setTimeout);

const checkDescribeTable = async ({ dynamodb, logger }) => {
  const movieTable = await dynamodb.describeTable({ TableName: 'BondMovies' }).promise();
  logger.info({ msg: 'Movie Data', data: movieTable });
  return movieTable;
};

const checkListTables = async ({ dynamodb, logger }) => {
  await dynamodb.listTables().promise();
};

const getDocumentClient = async ({ config, logger, waitForTable = true }) => {
  do {
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
      const documentClient = await new AWS.DynamoDB.DocumentClient({
        params: dynamoDbParams,
        service: dynamodb,
        convertEmptyValues: true,
      });
      if (waitForTable) {
        await checkDescribeTable({ dynamodb, logger });
      } else {
        await checkListTables({ dynamodb, logger });
      }
      return documentClient;
    } catch (err) {
      logger.error({ msg: 'HOST_WAIT_INFO', err });
      await setTimeoutAsync(1000);
    }
  } while (true);
};

const getDynamoDBClient = async ({ config, logger, waitForTable = true }) => {
  do {
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
}