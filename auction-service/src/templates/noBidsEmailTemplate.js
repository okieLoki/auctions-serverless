const noBidsEmailTemplate = async (title, seller) => {
    return(
        `
        <h1>Your item has not been sold</h1>
        <p>Hi, ${seller}</p>
        <p>Unfortunately, your item has not been sold.</p>
        <p>Item title: ${title}</p>
        `
    )
}

module.exports = noBidsEmailTemplate;