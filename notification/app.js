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
              Data: `Customer Name: ${formData.customerName}\nFrom: ${formData.fromLocation}\nTo: ${formData.toLocation}\nTrip Sart Time: ${formData.tripStartTime}\nTrip End Time: ${formData.tripEndTime}\nFare: ${formData.fare}\nPayment Status: ${formData.paymentStatus}\n\n--Thanks for using our service`,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: 'Booking is created',
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
      customerName: dynamodb.NewImage.customerName.S,
      fromLocation: dynamodb.NewImage.fromLocation.S,
      toLocation: dynamodb.NewImage.toLocation.S,
      tripStartTime: dynamodb.NewImage.tripStartTime.S,
      tripEndTime: dynamodb.NewImage.tripEndTime.S,
      fare: dynamodb.NewImage.fare.N,
      paymentStatus: dynamodb.NewImage.paymentStatus.S
    }
    console.log(formData);

    return constructEmail(formData).then(data => {
        console.log(data);
    }).catch(error => {
        console.log(error);
    });
}