const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const clientSchema = Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female'],
  },
  birthdate: {
    type: Date,
  },
  status: {
    type: String,
    default: 'unconfirmed',
    enums: ['unconfirmed', 'confirmed', 'banned'],
  },
  confirmationTokenDate: {
    type: Date,
    default: Date.now,
  },
  _deleted: {
    type: Boolean,
    default: false,
  },
});

/**
 * Return the full name "Firstname lastname"
 */

clientSchema.virtual('fullName')
  .get(() => `${this.firstName} ${this.lastName}`);

/**
 * Hash the password before saving the model.
 */

clientSchema.pre('save', function preSave(done) {
  if (!this.isModified('password')) {
    done();
  } else {
    bcrypt.hash(this.password, null, null, (err, hashedPassword) => {
      if (err) {
        done(err);
      }
      this.password = hashedPassword;
      done();
    });
  }
});

/**
 * Check If {guess} matches the user password.
 */
clientSchema.methods.checkPassword = (guess, done) => {
  bcrypt.compare(guess, this.password, (err, matching) => {
    done(err, matching);
  });
};

module.exports = mongoose.model('Client', clientSchema);
