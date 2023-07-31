const AWS = require('aws-sdk');
const commonMiddleware = require('../lib/commonMiddleware')
const createError = require('http-errors');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const getAuction = async (event) => {
    const { id } = event.pathParameters;

    try {
        const result = await dynamodb.get({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: { id },
        }).promise();

        const auction = result.Item;

        if (!auction) {
            throw new createError.NotFound(`Auction with ID ${id} not found`);
        }

        return {
            statusCode: 200,
            body: JSON.stringify(auction),
        };
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError('Error fetching auction');
    }
};

module.exports.handler = commonMiddleware(getAuction)
