const getEndedAuctions = require('../lib/getEndedAuctions')

const processAuctions = async (event) => {
    const auctionsToClose = await getEndedAuctions()
}

module.exports.handler = processAuctions;