/**
 * Mailer Service
 */

const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const Admin = require('../../models/admin/Admin');

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
    subject: 'Git Rekt Confirm Email',
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

exports.notifyAdminOfNewBusinessSignup = () => {
  const emailContent = {
    from: info.from,
    subject: '[Git-Rekt] New Business Signup',
    html: `
            Hello, <br />
            A new business has requested to signup and be listed on the directory waiting for approval.
            --------------------------------- <br/>
            This is an automated message.
      `,
    text: `
       Hello,
       A new business has requested to signup and be listed on the directory waiting for approval.
      `,
  };

  Admin.findOne()
    .then(((adminInfo) => {
      emailContent.to = [adminInfo.email];
      return new Promise((resolve, reject) => {
        mailer.sendMail(emailContent, (err, information) => {
          if (err) {
            return reject(err);
          }
          return resolve(information);
        });
      });
    }))
    .catch((err) => {
      throw err; // TODO: Handle in a better way
    });
};
