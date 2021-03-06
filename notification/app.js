const AWS = require('aws-sdk');
const SES = new AWS.SES();

const FROM_EMAIL_ADDRESS = process.env.FROM_EMAIL_ADDRESS;
const TO_EMAIL_ADDRESS = process.env.TO_EMAIL_ADDRESS;

function constructBookingEmail(formData) {

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
            Data: 'Booking created',
          },
        },
    };

    console.log(emailParams)

    const promise =  SES.sendEmail(emailParams).promise();
    console.log(promise);
    return promise
}


exports.sendBookingEmail = async(event) => {
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

    return constructBookingEmail(formData).then(data => {
        console.log(data);
    }).catch(error => {
        console.log(error);
    });
}

function constructPaymentEmail(formData) {

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
            Data: `Customer Name: ${formData.customerName}\nFare: ${formData.fare}\n\n--Thanks for using our service`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Payment recieved',
        },
      },
  };

  console.log(emailParams)

  const promise =  SES.sendEmail(emailParams).promise();
  console.log(promise);
  return promise
}


exports.sendPaymentEmail = async(event) => {
  console.log('Send email called');
  console.log(event);

  const dynamodb = event.Records[0].dynamodb;
  console.log(dynamodb);

  const formData = {
    customerName: dynamodb.NewImage.customerName.S,
    fare: dynamodb.NewImage.fare.N,
  }
  console.log(formData);

  return constructPaymentEmail(formData).then(data => {
      console.log(data);
  }).catch(error => {
      console.log(error);
  });
}

function constructOfferEmail(formData) {

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
            Data: `Customer Name: ${formData.customerName}\nOffer: ${formData.message}\n\n--Thanks for using our service`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'You have a offer',
        },
      },
  };

  console.log(emailParams)
  const promise =  SES.sendEmail(emailParams).promise();
  console.log(promise);
  return promise
}

exports.sendOfferEmail = async(event) => {
  console.log('Send email called');
  console.log(event);

  const dynamodb = event.Records[0].dynamodb;
  console.log(dynamodb);

  const formData = {
    customerName: dynamodb.NewImage.customerName.S,
    message: dynamodb.NewImage.message.S
  }
  console.log(formData);

  return constructOfferEmail(formData).then(data => {
      console.log(data);
  }).catch(error => {
      console.log(error);
  });
}