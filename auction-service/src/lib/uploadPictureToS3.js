const AWS = require('aws-sdk');
const {createError} = require('http-errors')

const s3 = new AWS.S3();

const uploadPictureToS3 = async (key, body) => {
    try {
        const result = await s3.upload({
            Bucket: process.env.AUCTIONS_BUCKET_NAME,
            Key: key,
            Body: body,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
        }).promise()

        return result
        
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }
}

module.exports = uploadPictureToS3;