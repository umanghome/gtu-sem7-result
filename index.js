var request = require('request');
var nodemailer = require('nodemailer');
var moment = require('moment');

var url = 'http://gtu.ac.in/result.aspx';
var searchStr = 'BE SEM 7 - Regular';
var username = 'gmail_username';
var password = 'gmail_password';
var emailReceivers = ['user@service.com', 'friend@service.com'];
var timeInMins = 15; // How frequently do you want to check?
var transporter = nodemailer.createTransport('smtps://' + username + '%40gmail.com:' + password + '@smtp.gmail.com');
var mailOptions = {
  from: 'your_name',
  to: emailReceivers.join(', '),
  subject: '7th Semester results are out!',
  text: '7th Semester results are out! Or at least my script thinks so. In any case, call me.',
  html: '7th Semester results are out! Or at least my script thinks so. In any case, call me.'
};

searchStr = searchStr.toLowerCase();

var resultIsOut = false;

function areResultsOut () {
  request(url, function (error, response, body) {
    if (error) {
      console.log('Some error occurred while fetching the web page:' + response.statusCode);
      return;
    }
    if (response) {
      if (!body) {
        console.log('No body was returned: ' + response.statusCode);
        return;
      }

      body = body.toLowerCase();

      if (body.indexOf(searchStr) < 0) {
        console.log('Results are not out yet.');
        return;
      }

      console.log('Results are out!');

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log('An error occurred while sending out emails: ' + info.response);
        } else {
          resultIsOut = true;
          console.log('Sent out the emails: ' + info.response);
          process.exit(0);
        }
      });

    }
  });
}

setInterval(function () {
  console.log(moment().format("\n\ndddd, MMMM Do YYYY, h:mm:ss a"));
  if (!resultIsOut) {
    areResultsOut();
  }
}, timeInMins * 60000);