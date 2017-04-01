/**
 * Helper Module For Client Authentication
 */

const jwt = require('jsonwebtoken');
const Client = require('../../models/client/Client');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

/**
 * Generate 1 Hour JWT token.
 * @private
 * @param {*} payload the payload to inject in the token.
 */

const generateToken = payload =>
  jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: '1h',
  });

/**
 * Generate Token for Client Email Confirmation
 */

exports.generateConfirmationToken = (email) => {
  const token = generateToken({
    email,
    type: 'ConfirmEmail',
    iat: Math.floor(Math.floor(Date.now() / 1000)),
  });

  return new Promise((resolve, reject) => {
    Client.findOne({
      email,
    })
      .then((userData) => {
        if (!userData) {
          reject('User not found.');
        }
        if (userData.status !== 'unconfirmed') {
          reject('User email already confirmed.');
        }
        userData.confirmationTokenDate = Date.now();
        userData.save()
          .then(() => resolve(token))
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
};


/**
 * Login Client
 */

exports.loginClient = (email, password) => new Promise((resolve, reject) => {
  Client.findOne({
    email,
    _deleted: false,
  })
    .then((user) => {
      if (!user) {
        reject('Invalid Credentials.');
      } else if (user.status === 'unconfirmed') {
        reject('Please confirm your email.');
      } else if (user.status === 'banned') {
        reject('This user has been banned.');
      } else {
        user.checkPassword(password)
          .then((matching) => {
            if (!matching) {
              reject('Invalid Credentials.');
            } else {
              const token = jwt.sign({
                id: user._id,
              }, process.env.JWT_KEY, {
                expiresIn: '10d',
              });
              resolve({
                message: 'Client Login Sucess.',
                id: user._id,
                email: user.email,
                token,
              });
            }
          })
          .catch(reject);
      }
    })
    .catch(reject);
});
