const { createError } = require('http-errors')
const getEndedAuctions = require('../lib/getEndedAuctions')
const closeAuction = require('../lib/closeAuction')

const processAuctions = async (event) => {

    try {
        const auctionsToClose = await getEndedAuctions()
        const closePromises = auctionsToClose.map(auction => {
            return closeAuction(auction)
        })

        await Promise.all(closePromises)

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Auctions closed successfully',
                closed: closePromises.length
            })
        }
    } catch (error) {

        console.error(error)
        throw new createError.InternalServerError(error)

    }

}

module.exports.handler = processAuctions;