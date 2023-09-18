const AWS = require('aws-sdk')

const ses = new AWS.SES({ region: 'us-east-1' })

const sendMail = async (event) => {

    const record = event.Record[0];
    
    const email = JSON.parse(record.body)
    const {subject, body, recipient} = email

    const params = {
        Source: 'testuddeepta@gmail.com',
        Destination: {
            ToAddresses: [recipient]
        },
        Message: {
            Body: {
                Text: {
                    Data: body
                }
            },
            Subject: {
                Data: subject
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


module.exports.handler = sendMail