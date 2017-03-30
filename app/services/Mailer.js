/**
 * Mailer Service
 * @class Mailer
 */

const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

class Mailer {
  constructor() {
    this.mailer = nodemailer.createTransport(sgTransport({
      auth: {
        api_key: process.env.SEND_GRID,
      },
    }));
    this.from = 'mohamedelzarei@gmail.com';
  }

  clientConfirmEmail(email, host, resetToken, cb) {
    const emailTemplateVars = {
      confirmUrl: `http://${host}/client/confirm/${resetToken}`,
      title: 'Git Rekt Directory',
    };

    const emailContent = {
      to: [email],
      from: this.from,
      subject: 'Gi Rekt Confirm Email',
      html: `
            Hello,
            Thanks for registering on our ${emailTemplateVars.title}, to confirm your email click
            <a href="${emailTemplateVars.confirmUrl}">Here</a>.
      `,
      text: `
      Hello,
      Thanks for registering on our ${emailTemplateVars.title}, to confirm your email
      copy and paste the following url into your browser ${emailTemplateVars.confirmUrl}.
      `,
    };

    this.mailer.sendMail(emailContent, cb);
  }
}

module.exports = Mailer;
