const AWS = require('aws-sdk');
const commonMiddleware = require('../lib/commonMiddleware')
const createError = require('http-errors');
const {getAuctionById} = require('./getAuction')
const validator = require('@middy/validator')
const {transpileSchema} = require('@middy/validator/transpile')
const placeBidSchema = require('../lib/schemas/placeBidSchema')

const dynamodb = new AWS.DynamoDB.DocumentClient();

const placeBid = async (event) => {
    const {id} = event.pathParameters
    const {amount} = event.body
    const {email} = event.requestContext.authorizer.lambda

    const auction = await getAuctionById(id)

    if(email === auction.seller){
        throw new createError.Forbidden('You cannot bid on your own auctions!')
    }

    if(email === auction.highestBid.bidder){
        throw new createError.Forbidden('You are already the highest bidder!')
    }

    if(amount <= auction.highestBid.amount){
        throw new createError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}`)
    }

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: {id},
        UpdateExpression: 'set highestBid.amount = :amount, highestBid.bidder = :bidder',
        ExpressionAttributeValues: {
            ':amount' : amount,
            ':bidder' : email
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
    .use(validator({
        eventSchema: transpileSchema(placeBidSchema),
        ajvOptions: {
            useDefaults: true,
            strict: false
        }
    }))
