const nodemailer = require('nodemailer');

const user = process.env.EMAIL_USER || 'snnap@gmail.com';
const auth = {
  user,
  pass: process.env.EMAIL_PASS || 'snnap_password',
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth,
});

const Email = class {
  static sendMail(t, subject, text, html) {
    let to = t;
    // stack the emails if needed
    if (Array.isArray(t)) {
      to = t.join();
    }

    // set up our mailer options
    const mailOptions = {
      from: user,
      to,
      subject,
      text,
      html,
    };

    // send the email
    transporter.sendMail(mailOptions);
  }
};

module.exports = Email;
