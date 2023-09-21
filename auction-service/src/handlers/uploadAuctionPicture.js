const {getAuctionById} = require('./getAuction');

const uploadAuctionPicture = async (event) => {

    const { id } = event.pathParameters;
    const auction = await getAuctionById(id);
    const b64 = event.body.replace(/^data:image\/\w+;base64,/, "")
    const buffer = Buffer.from(b64, 'base64');

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "YAYY"
        })
    }
}

module.exports.handler = uploadAuctionPicture;