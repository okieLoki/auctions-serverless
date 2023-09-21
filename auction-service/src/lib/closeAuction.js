const AWS = require('aws-sdk');
const buyerEmailTemplate = require('../templates/buyerEmailTemplate');
const sellerEmailTemplate = require('../templates/sellerEmailTemplate');
const noBidsEmailTemplate = require('../templates/noBidsEmailTemplate')

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

const closeAuction = async(auction) => {

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: {
            id: auction.id
        },
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeValues: {
            ':status': 'CLOSED'
        },
        ExpressionAttributeNames: {
            '#status': 'status'
        }
    }

    await dynamoDB.update(params).promise();

    const { title, seller, highestBid } = auction;
    const { amount, bidder } = highestBid;

    if (amount === 0) {
        await sqs.sendMessage({
            QueueUrl: process.env.MAIL_QUEUE_URL,
            MessageBody: JSON.stringify({
                subject: 'No bids on your auction item :(',
                recipient: seller,
                body: noBidsEmailTemplate(title, seller),
            })
        }).promise();
        return;
    }

    const notifySeller = sqs.sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
            subject: 'Your item has been sold!',
            recipient: seller,
            body: sellerEmailTemplate(title, amount, seller),
        })
    }).promise();

    const notifyBidder = sqs.sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
            subject: 'You won an auction!',
            recipient: bidder,
            body: buyerEmailTemplate(title, amount, bidder),
        })
    }).promise();
    
    return Promise.all[notifySeller, notifyBidder]
}

module.exports = closeAuction;