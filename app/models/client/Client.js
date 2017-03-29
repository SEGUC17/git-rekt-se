const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const clientSchema = Schema({
  email: {
    type: String,
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
    default: Date.now,
  },
  _deleted: {
    type: Boolean,
    default: false,
  },
});

clientSchema.virtual('fullName')
  .get(() => `${this.firstName} ${this.lastName}`);

clientSchema.pre('save', (done) => {
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

clientSchema.methods.checkPassword = (guess, done) => {
  bcrypt.compare(guess, this.password, (err, matching) => {
    done(err, matching);
  });
};

module.exports = mongoose.model('Client', clientSchema);
