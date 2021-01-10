const AWS = require('aws-sdk');
const SES = new AWS.SES();

const FROM_EMAIL_ADDRESS = process.env.FROM_EMAIL_ADDRESS;
const TO_EMAIL_ADDRESS = process.env.TO_EMAIL_ADDRESS;

function constructEmail(formData) {

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
              Data: `Customer Name: ${formData.customerName}\nDestination: ${formData.destination}\nTrip Sart Time: ${formData.tripStartTime}\nTrip End Time: ${formData.tripEndTime}\nFare: ${formData.fare}\n Thanks for using our service`,
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
	console.log(event);

    const dynamodb = event.Records[0].dynamodb;
    console.log(dynamodb);

    const formData = {
        user : dynamodb.NewImage.user.S,
        destination : dynamodb.NewImage.destination.S,
        price : dynamodb.NewImage.price.N
    }
    console.log(formData);

    return constructEmail(formData).then(data => {
        console.log(data);
    }).catch(error => {
        console.log(error);
    });
}