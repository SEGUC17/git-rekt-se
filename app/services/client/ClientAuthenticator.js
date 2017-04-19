/**
 * Helper Module For Client Authentication
 */

const jwt = require('jsonwebtoken');
const Client = require('../../models/client/Client');
const mongoose = require('mongoose');
const Strings = require('../shared/Strings');

mongoose.Promise = Promise;

/**
 * Generate 1 Hour JWT token.
 * @private
 * @param {*} payload the payload to inject in the token.
 */

const generateToken = payload =>
  jwt.sign(payload, process.env.JWT_KEY_CLIENT, {
    expiresIn: '1h',
  });

/**
 * Generate Token for Client Email Confirmation.
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
          reject(Strings.clientConfirmation.notFound);
        }
        if (userData.status !== 'unconfirmed') {
          reject(Strings.clientConfirmation.emailAlreadyConfirmed);
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
 * Login Client.
 */

exports.loginClient = (email, password) => new Promise((resolve, reject) => {
  Client.findOne({
    email,
    _deleted: false,
  })
    .then((user) => {
      if (!user) {
        reject(Strings.clientLoginMessages.invalidCreds);
      } else if (user.status === 'unconfirmed') {
        reject(Strings.clientLoginMessages.invalidCreds);
      } else if (user.status === 'banned') {
        reject(Strings.clientLoginMessages.bannedClient);
      } else {
        user.checkPassword(password)
          .then((matching) => {
            if (!matching) {
              reject(Strings.clientLoginMessages.invalidCreds);
            } else {
              const token = jwt.sign({
                id: user._id,
              }, process.env.JWT_KEY_CLIENT, {
                expiresIn: '1m',
              });
              resolve({
                message: Strings.clientLoginMessages.loginSuccess,
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


/**
 * Login Client facebook.
 */

exports.loginFacebook = (email, id) => {
  const token = jwt.sign({
    id,
    email,
  }, process.env.JWT_KEY_CLIENT, {
    expiresIn: '10d',
  });

  // expires in 5 minutes
  const encapsulate = jwt.sign({
    token,
  }, process.env.JWT_KEY_CLIENT, {
    expiresIn: '5m',
  });

  return encapsulate;
};

exports.finalizeLoginFacebook = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_KEY_CLIENT, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        jwt.verify(decoded.token, process.env.JWT_KEY_CLIENT, (error, payload) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              token: decoded.token,
              payload,
            });
          }
        });
      }
    });
  });
