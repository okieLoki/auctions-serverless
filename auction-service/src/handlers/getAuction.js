const AWS = require('aws-sdk');
const commonMiddleware = require('../lib/commonMiddleware');
const createError = require('http-errors');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const getAuctionById = async (id) => {
    let auction;
    try {
        const result = await dynamodb.get({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: { id },
        }).promise();

        auction = result.Item;
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    if (!auction) {
        throw new createError.NotFound(`Auction with ID ${id} not found`);
    }

    return auction;
};

const getAuction = async (event) => {
    const { id } = event.pathParameters;

    const auction = await getAuctionById(id);

    return {
        statusCode: 200,
        body: JSON.stringify(auction),
    };
};

module.exports = {
    getAuctionById,
    handler: commonMiddleware(getAuction),
};
