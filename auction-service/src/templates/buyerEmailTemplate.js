const buyerEmailTemplate = (title, amount, bidder) => {
    return (`

        <h1>You won an auction!</h1>
        <p>Hi, ${bidder}</p>
        <p>Congratulations! You won the auction for ${title}.</p>
        <p>Item price: $${amount}</p>
    `
    )
}

module.exports = buyerEmailTemplate;