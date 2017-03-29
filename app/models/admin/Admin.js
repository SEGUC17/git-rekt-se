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
  },
  password: {
    type: String,
    required: true,
  },
});

/**
 * Hash password before saving the document
 */

adminSchema.pre('save', (done) => {
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

adminSchema.methods.checkPassword = (guess, done) => {
  bcrypt.compare(guess, this.password, (err, matching) => {
    done(err, matching);
  });
};

module.exports = mongoose.model('Admin', adminSchema);
