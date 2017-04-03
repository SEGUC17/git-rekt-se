/**
 * Helper Module For Business Authentication.
 */

const jwt = require('jsonwebtoken');
const Business = require('../../models/business/Business');
const mongoose = require('mongoose');
const Strings = require('../shared/Strings');

mongoose.Promise = Promise;


/**
 * Login Business.
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
