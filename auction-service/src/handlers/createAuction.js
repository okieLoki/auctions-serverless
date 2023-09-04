const { v4: uuid } = require('uuid')
const AWS = require('aws-sdk')
const commonMiddleware = require('../lib/commonMiddleware')
const createError = require('http-errors')

const dynamodb = new AWS.DynamoDB.DocumentClient()

const createAuction = async (event) => {

  const { title } = event.body;
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1)

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    }
  }

  try {
    await dynamodb.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,
    }).promise()
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
};

module.exports.handler = commonMiddleware(createAuction)
