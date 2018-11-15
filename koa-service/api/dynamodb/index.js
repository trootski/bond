const AWS = require('aws-sdk');

const getDynamoDBFilms = async (ctx, next) => {
  // const dynamodb = new AWS.DynamoDB();
  const dynamoDbParams = {
    apiVersion: '2012-08-10',
    convertEmptyValues: true,
    region: 'eu-west-1',
    endpoint: 'http://localhost:8000'
  };
  const dynamodb = await new AWS.DynamoDB.DocumentClient(dynamoDbParams);
  const res = await dynamodb.get({
    ConsistentRead: false,
    Key: {
      Director: 'Broccoli',
      MovieTitle: 'Dr. No',
    },
    TableName: 'BondMovies',
  }).promise();
  console.log(res);
  ctx.body = { 'ok': true };
};

module.exports = {
  getDynamoDBFilms,
};
