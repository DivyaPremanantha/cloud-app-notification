const AWS = require('aws-sdk');
const SES = new AWS.SES();

const FROM_EMAIL_ADDRESS = process.env.FROM_EMAIL_ADDRESS;
const TO_EMAIL_ADDRESS = process.env.TO_EMAIL_ADDRESS;

function sendEmailToMe(formData) {

    const emailParams = {
        Source: FROM_EMAIL_ADDRESS, 
        ReplyToAddresses: [TO_EMAIL_ADDRESS],
        Destination: {
          ToAddresses: [TO_EMAIL_ADDRESS], 
        },
        Message: {
          Body: {
            Text: {
              Charset: 'UTF-8',
              Data: `UserID: ${formData.user}\n\n Destination: ${formData.destination}\n Price: ${formData.price}\n Thanks for using our service`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: 'Your booking is created',
          },
        },
    };

    console.log(emailParams)

    const promise =  SES.sendEmail(emailParams).promise();
    console.log(promise);
    return promise
}


exports.sendEmail = async(event) => {
    console.log('Send email called');

	const dynamodb = event.Records[0].dynamodb;
    console.log(dynamodb);

    const formData = {
        name : dynamodb.NewImage.user.S,
        message : dynamodb.NewImage.destination.S,
        email : dynamodb.NewImage.price.N
    }
    console.log(formData);

    return sendEmailToMe(formData).then(data => {
        console.log(data);
    }).catch(error => {
        console.log(error);
    });
}