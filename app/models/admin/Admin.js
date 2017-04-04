const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

/**
 * Adminstrator Schema
 */

const adminSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordChangeDate: {
    type: Date,
    default: Date.now,
  },
  _deleted: {
    type: Boolean,
    default: false,
  },
});

/**
 * Hash password before saving the document
 */

adminSchema.pre('save', function isDone(done) {
  if (!this.isModified('password')) {
    done();
  } else {
    bcrypt.hash(this.password, null, null, (err, hashedPassword) => {
      if (err) {
        return done(err);
      }

      this.password = hashedPassword;
      return done();
    });
  }
});

/**
 * Check the password
 */

adminSchema.methods.checkPassword = function checkPassword(guess) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(guess, this.password, (err, matching) => {
      if (err) {
        return reject(err);
      }
      return resolve(matching);
    });
  });
};

module.exports = mongoose.model('Admin', adminSchema);
