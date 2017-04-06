/**
 * Mailer Service
 */

const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const Admin = require('../../models/admin/Admin');
const Business = require('../../models/business/Business');

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
            A new business has requested to signup and be listed on the directory waiting for approval.<br />
            --------------------------------- <br />
            This is an automated message.
      `,
    text: `
       Hello,
       A new business has requested to signup and be listed on the directory waiting for approval.
      `,
  };

  return new Promise((resolve, reject) => {
    Admin.findOne({})
      .then((userInfo) => {
        emailContent.to = [userInfo.email];
        mailer.sendMail(emailContent, (err, information) => {
          if (err) {
            return reject(err);
          }
          return resolve(information);
        });
      })
      .catch(reject);
  });
};

exports.forgotPasswordEmail = (email, host, resetToken) => {
  const mailOptions = {
    to: email,
    from: 'passwordreset@demo.com',
    subject: 'Node.js Password Reset',
    text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      'http://'}${host}/reset/${resetToken}\n\n` +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n',
  };

  return new Promise((resolve, reject) => {
    mailer.sendMail(mailOptions, (err, information) => {
      if (err) {
        return reject(err);
      }
      return resolve(information);
    });
  });
};

exports.notifyBusinessOfConfirmation = (host, mail, token) => {
  const emailContent = {
    from: info.from,
    to: mail,
    subject: 'Git Rekt Application Accepted',
    text: `
       Hello,
       Your application for our directory [Git-Rekt] has been Accepted.\n\n 
       Please click on the following link, or paste this into your browser to complete the process:
       http://${host}/confirm/signup/${token}
      ---------------------------------
      This is an automated message.`,
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

exports.notifyBusinessOfDenial = (mail) => {
  const emailContent = {
    from: info.from,
    to: mail,
    subject: 'Git Rekt Application Denied',
    text: `
       Hello,
       Your application for our directory [Git-Rekt] has been Denied.
       ---------------------------------
       This is an automated message.
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
