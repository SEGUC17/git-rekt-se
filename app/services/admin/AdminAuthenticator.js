/**
  * Helper Module For Admin Authentication.
  */

const jwt = require('jsonwebtoken');
const Admin = require('../../models/admin/Admin');
const mongoose = require('mongoose');
const Strings = require('../shared/Strings');


mongoose.Promise = Promise;

/**
 * Login Admin
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
