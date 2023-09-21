const uploadPictureToS3 = require('../lib/uploadPictureToS3');
const createError = require('http-errors');
const middy = require('@middy/core');
const httpErrorHandler = require('@middy/http-error-handler');
const { getAuctionById } = require('./getAuction');
const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const uploadAuctionPicture = async (event) => {
    const { id } = event.pathParameters;

    try {
        const auction = await getAuctionById(id);
        const b64 = event.body.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(b64, 'base64');

        const {email} = event.requestContext.authorizer;

        if(email != auction.seller) {
            throw new createError.Forbidden(`You are not the seller of this auction!`);
        }

        const uploadToS3Result = await uploadPictureToS3(auction.id + '.jpg', buffer);

        const updatedAuction = await dynamodb.update({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Key: { id },
            UpdateExpression: 'set pictureUrl = :pictureUrl',
            ExpressionAttributeValues: {
                ':pictureUrl': uploadToS3Result.Location,
            },
            ReturnValues: 'ALL_NEW',
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(updatedAuction.Attributes),
        };
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }
};

module.exports.handler = middy(uploadAuctionPicture).use(httpErrorHandler());
