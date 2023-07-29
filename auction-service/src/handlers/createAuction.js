const { v4: uuid} = require('uuid')
const AWS = require('aws-sdk')

const dynamodb = new AWS.DynamoDB.DocumentClient()

const createAuction = async (event) => {

  const { title } = JSON.parse(event.body)
  const now = new Date();

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
  }

  await dynamodb.put({
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Item: auction,
  }).promise()

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

module.exports.handler = createAuction;
