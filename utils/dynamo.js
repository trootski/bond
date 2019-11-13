const AWS = require('aws-sdk');

const getDocumentClient = async ({ config, logger }) => {
  const dynamoDbParams = {
    apiVersion: config.get('dynamodb:apiVersion'),
    convertEmptyValues: true,
    accessKeyId: config.get('dynamodb:accessKeyId'),
    secretAccessKey: config.get('dynamodb:secretAccessKey'),
    endpoint: config.get('dynamodb:dynamoDBEndpoint'),
    logger,
    region: config.get('dynamodb:region'),
  };
  
  const client = await new AWS.DynamoDB(dynamoDbParams);
  const dynamodb = await new AWS.DynamoDB.DocumentClient({
    params: dynamoDbParams,
    service: client,
    convertEmptyValues: true,
  });
  return dynamodb;
};

module.exports = {
    getDocumentClient,
}