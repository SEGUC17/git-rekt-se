/**
 * Helper Module For Business Authentication.
 */

const jwt = require('jsonwebtoken');
const Business = require('../../models/business/Business');
const mongoose = require('mongoose');
const Strings = require('../shared/Strings');

mongoose.Promise = Promise;

/**
 * Represents the Object sent to the Business Upon Login Success.
 * @typedef {Object} BusinessLoginSuccess
 * @property {string} message - Success Message.
 * @property {string} email - Email.
 * @property {mongoose.ObjectId} id - ID in Mongoose DB.
 * @property {string} token - A JWT Token.
 */

/**
 * Login Business.
 * @param {string} email - Business' Email.
 * @param {string} password - Business' Password.
 * @returns {Promise<BusinessLoginSuccess>} - Resolves if no error occurs and has valid
 * credentials, otherwise rejects.
 */
exports.loginBusiness = (email, password) => new Promise((resolve, reject) => {
  Business.findOne({
    email,
    _deleted: false,
  })
    .then((user) => {
      if (!user) {
        reject(Strings.businessLoginMessages.invalidCreds);
      } else if (user._status === 'unverified') {
        reject(Strings.businessLoginMessages.pendingVerification);
      } else if (user._status === 'removed') {
        reject(Strings.businessLoginMessages.removeBusiness);
      } else {
        user.checkPassword(password)
          .then((matching) => {
            if (!matching) {
              reject(Strings.businessLoginMessages.invalidCreds);
            } else {
              const token = jwt.sign({
                id: user._id,
              }, process.env.JWT_KEY_BUSSINES, {
                expiresIn: '10d',
              });
              resolve({
                message: Strings.businessLoginMessages.loginSuccess,
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
 * Verify's a token and decodes it.
 * @param {string} token - A JWT Token.
 * @returns {Promise<Object>} - Resolves if no error occurs, otherwise rejects.
 */
exports.verifyBusiness = token => new Promise((resolve, reject) => {
  jwt.verify(token, process.env.JWT_KEY_BUSSINES, (err, decoded) => {
    if (err) {
      reject(err);
    } else {
      resolve(decoded);
    }
  });
});

/**
 * Generate Verify SignUp Token.
 * @param {string} email - Business Email.
 * @returns {Promise<string>} - Resolves with a JWT Token if no error occurs,
 * otherwise rejects.
 */
exports.generateSignUpToken = (email) => {
  const token = jwt.sign({
    email,
    type: 'Verify SignUp',
    iat: Math.floor(Math.floor(Date.now() / 1000)),
  }, process.env.JWT_KEY_BUSSINES, {
    expiresIn: '7d',
  });
  return new Promise((resolve, reject) => {
    Business.findOne({
      email,
    })
      .exec()
      .then((business) => {
        business.confirmationTokenDate = Date.now();
        business.save()
          .then(() => resolve(token))
          .catch(reject);
      })
      .catch(reject);
  });
};
