const AWS = require('aws-sdk');

const request = require('request');
const { getMovieDetails } = require('../utils/omdb-api.js');
const filmMeta = require('../../film-data/film-meta.json');

const dynamoDbParams = {
  apiVersion: '2012-08-10',
  convertEmptyValues: true,
  region: 'eu-west-1',
  endpoint: 'http://localhost:8000'
};

const resetDynamoDB = async (ctx, next) => {
  // const dynamodb = new AWS.DynamoDB();
  const dynamodb = await new AWS.DynamoDB(dynamoDbParams);
  const { TableNames: allTables  } = await dynamodb.listTables({}).promise();
  if (allTables.includes('BondMovies')) {
    await dynamodb.deleteTable({ TableName: 'BondMovies' }).promise();
  }
  const createRes = await dynamodb.createTable({
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
  ctx.body = { 'ok': true };
};

const getDynamoDBFilms = async (ctx, next) => {
  // const dynamodb = new AWS.DynamoDB();
  const dynamodb = await new AWS.DynamoDB.DocumentClient(dynamoDbParams);
  const res = await dynamodb.get({
    ConsistentRead: false,
    Key: {
      Director: 'Broccoli',
      MovieTitle: 'Dr. No',
    },
    TableName: 'BondMovies',
  }).promise();
  ctx.body = { 'ok': true, data: JSON.stringify(res) };
};

const importFilmsToDynamoDB = async (ctx, next) => {
  const res = await Promise.all(
    filmMeta.data
      .map(v => v.title)
      .map(getMovieDetails));
  console.log(res);
  ctx.body = { 'ok': true };
};

module.exports = {
  getDynamoDBFilms,
  importFilmsToDynamoDB,
  resetDynamoDB,
};
