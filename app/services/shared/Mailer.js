/**
 * Mailer Service
 */

const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

/**
 * Mailer Configuration
 */

const mailer = nodemailer.createTransport(sgTransport({
  auth: {
    api_key: process.env.SEND_GRID,
  },
}));

const info = {
  from: 'mohamedelzarei@gmail.com',
};

exports.clientConfirmEmail = (email, host, resetToken) => {
  const emailTemplateVars = {
    confirmUrl: `http://${host}/client/confirm/${resetToken}`,
    title: 'Git Rekt Directory',
  };

  const emailContent = {
    to: [email],
    from: info.from,
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
  return new Promise((resolve, reject) => {
    mailer.sendMail(emailContent, (err, information) => {
      if (err) {
        return reject(err);
      }
      return resolve(information);
    });
  });
};
