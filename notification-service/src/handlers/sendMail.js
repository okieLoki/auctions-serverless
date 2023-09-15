const AWS = require('aws-sdk')

const ses = new AWS.SES({ region: 'us-east-1' })

const sendMail = async (event) => {

    const params = {
        Source: 'testuddeepta@gmail.com',
        Destination: {
            ToAddresses: ['uddeeptaraajkashyap@gmail.com']
        },
        Message: {
            Body: {
                Text: {
                    Data: 'Hello from AWS SES'
                }
            },
            Subject: {
                Data: 'Hello from AWS SES'
            }
        }
    }

    try {
        const result = await ses.sendEmail(params).promise()

        console.log(result)

    } catch (error) {
        console.log(error)
    }
}

sendMail()

module.exports.handler = sendMail