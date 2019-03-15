#!/usr/bin/env node

'use strict'

const AWS = require('aws-sdk');

const main = async () => {
  const dynamoDbParams = {
    apiVersion: '2012-08-10',
    convertEmptyValues: true,
    region: 'eu-west-1',
    endpoint: 'http://db:8000'
  };

  console.log('Connecting to DynamoDB...');
  const dynamodb = await new AWS.DynamoDB(dynamoDbParams);

  console.log('Listing Tables...');
  const { TableNames: allTables  } = await dynamodb.listTables({}).promise();

  if (allTables.includes('BondMovies')) {
    console.log('Dropping old tables...');
    await dynamodb.deleteTable({ TableName: 'BondMovies' }).promise();
  }

  console.log('Creating BondMovies tables...');
  return await dynamodb.createTable({
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
};

main().then(
  val => console.log,
  err => console.error
);

