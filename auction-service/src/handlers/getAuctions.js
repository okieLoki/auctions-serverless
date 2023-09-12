const AWS = require('aws-sdk')
const commonMiddleware = require('../lib/commonMiddleware')
const validator = require('@middy/validator')
const {transpileSchema} = require('@middy/validator/transpile')
const getAuctionSchema = require('../lib/schemas/getAuctionSchema')
const createError = require('http-errors')

const dynamodb = new AWS.DynamoDB.DocumentClient()

const getAuctions = async (event) => {
    let auctions;

    const { status } = event.queryStringParameters;

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeValues: {
            ':status': status,
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        },
    }

    try {
        const result = await dynamodb.query(params).promise()
        auctions = result.Items

    } catch (error) {
        console.log(error)
        throw new createError.InternalServerError(error)
    }

    return {
        statusCode: 200,
        body: JSON.stringify(auctions),
    }
};

module.exports.handler = commonMiddleware(getAuctions).use(
    validator({
        eventSchema: transpileSchema(getAuctionSchema),
        ajvOptions: {
            useDefaults: true,
            strict: false,
        }
    }))
