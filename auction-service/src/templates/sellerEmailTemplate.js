const sellerEmailTemplate = async (title, amount, seller) => {
    return (
        `
        <h1>Your item has been sold</h1>
        <p>Hi, ${seller}</p>
        <p>Congratulations! Your item has been sold for $${amount}.</p>
        <p>Item title: ${title}</p>
    `
    )
}

module.exports = sellerEmailTemplate;