const uploadAuctionPicture = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "YAYY"
        })
    }
}

module.exports.handler = uploadAuctionPicture;