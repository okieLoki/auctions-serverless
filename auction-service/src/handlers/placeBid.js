const AWS = require('aws-sdk');
const commonMiddleware = require('../lib/commonMiddleware')
const createError = require('http-errors');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const placeBid = async (event) => {
    const {id} = event.pathParameters
    const {amount} = event.body

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: {id},
        UpdateExpression: 'set highestBid.amount = :amount',
        ExpressionAttributeValues: {
            ':amount' : amount
        },
        ReturnValues: 'ALL_NEW'
    }

    let updatedAuction

    try {
        const result = await dynamodb.update(params).promise()

        updatedAuction = result.Attributes
    } catch (error) {
        console.log(error)
        throw new createError.InternalServerError(error)
    }

    return{
        statusCode: 200,
        body: JSON.stringify(updatedAuction)
    }
};

module.exports.handler = commonMiddleware(placeBid)