const AWS = require('aws-sdk')
const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')
const httpEventNormalizer = require('@middy/http-event-normalizer')
const createError = require('http-errors')

const dynamodb = new AWS.DynamoDB.DocumentClient()

const getAuctions = async (event) => {
    let auctions;

    try {
        const result = await dynamodb.scan({
            TableName: process.env.AUCTIONS_TABLE_NAME
        }).promise()

        auctions = result.Items

    } catch (error) {
        console.log(error)
        throw new createError.InternalServerError(error)
    }

    return{
        statusCode: 200,
        body: JSON.stringify(auctions),
    }
};

module.exports.handler = middy(getAuctions)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler())

