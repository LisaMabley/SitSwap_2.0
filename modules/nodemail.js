var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');

// setup e-mail data with unicode symbols
transporter.sendInvite = function(invitation, user, coop) {
  var htmlBody = '<p>' + invitation.message + '<br /><br /><a href="join.html">Click to join!</a>';
  var textBody = invitation.message;

  return mailOptions = {
      from: '"SitSwap" <sitswap@mail.com>',
      to: invitation.email, user.email ,
      subject: 'Invitation to join ' + coop.name , // Subject line
      text: textBody,
      html: htmlBody
  };
}

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});

module.exports = transporter;
