const nodemailer = require('nodemailer');

// Generate SMTP service account from ethereal.email
exports.sendMail = (from, to, subject, text, html) => {
  let transporter = nodemailer.createTransport(
    {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      },
      logger: false,
      debug: false // include SMTP traffic in the logs
    },
    {
      from: from,
      headers: {
        'X-Laziness-level': 1000 // just an example header, no need to use this
      }
    }
  );
  let message = {
    to: to,
    subject: subject,
    text: text,
    html: html
  };

  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log('Error occurred');
      console.log(error.message);
      return process.exit(1);
    }

    console.log('Mail sent successfully!');
    console.log(nodemailer.getTestMessageUrl(info));
    transporter.close();
  });

};