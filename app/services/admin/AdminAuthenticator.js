/**
  * Helper Module For Admin Authentication.
  */

const jwt = require('jsonwebtoken');
const Admin = require('../../models/admin/Admin');
const mongoose = require('mongoose');
const Strings = require('../shared/Strings');

/**
 * Change Mongoose Promise Library with the default one.
 */
mongoose.Promise = Promise;

/**
 * Represents the Object sent to the Admin Upon Login Success.
 * @typedef {Object} AdminLoginResponse
 * @property {string} message - Success Message.
 * @property {string} email - Email.
 * @property {mongoose.ObjectId} id - ID in Mongoose DB.
 * @property {string} token - A JWT Token.
 */

/**
 * Login Admin.
 * @param {string} email - Admin's Email.
 * @param {string} password - Admin's Password (The Guess).
 * @returns {Promise<AdminLoginResponse>} - Resolves if no error occurs and has valid credentials
 * otherwise rejects.
 */
exports.loginAdmin = (email, password) => new Promise((resolve, reject) => {
  Admin.findOne({
    email,
    _deleted: false,
  })
    .then((user) => {
      if (!user) {
        reject(Strings.adminLoginMessages.invalidCreds);
      } else {
        user.checkPassword(password)
          .then((matching) => {
            if (!matching) {
              reject(Strings.adminLoginMessages.invalidCreds);
            } else {
              const token = jwt.sign({
                id: user._id,
              }, process.env.JWT_KEY_ADMINISTRATOR, {
                expiresIn: '10d',
              });
              resolve({
                message: Strings.adminLoginMessages.loginSuccess,
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
