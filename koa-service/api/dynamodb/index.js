const AWS = require('aws-sdk');

const request = require('request');
const fs = require('fs');

const dynamoDbParams = {
  apiVersion: '2012-08-10',
  convertEmptyValues: true,
  region: 'eu-west-1',
  endpoint: 'http://localhost:8000'
};

const getDynamoDBFilms = async (ctx, next) => {
  // const dynamodb = new AWS.DynamoDB();
  const dynamodb = await new AWS.DynamoDB.DocumentClient(dynamoDbParams);
  const res = await dynamodb.get({
    ConsistentRead: false,
    TableName: 'BondMovies',
  }).promise();
  ctx.body = { 'ok': true, data: JSON.stringify(res) };
};

module.exports = {
  getDynamoDBFilms,
};
