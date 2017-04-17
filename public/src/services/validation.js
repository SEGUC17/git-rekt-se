export default {

};

export const clientSignUpValidation = {
  email: [{
    required: true,
    message: 'An Email is required.',
    trigger: 'blur',
  }, {
    type: 'email',
    message: 'Must be an email.',
    trigger: 'blur',
  }],
  password: [{
    required: true,
    message: 'A Password is required.',
    trigger: 'blur',
  }, {
    pattern: /^(?=.*\d).{8,15}$/,
    message: 'Password must be between 8 and 15 characters and contains at least one number.',
    trigger: 'blur',
  }, {
    validator(rule, value, callBack) {
      this.$refs.form.validateField('confirmPassword');
      callBack();
    },
    trigger: ['blur', 'change'],
  }],
  confirmPassword: [{
    required: true,
    message: 'Please Confirm the password',
    trigger: 'blur',
  }, {
    validator(rule, value, callBack) {
      if (this.form.password.length > 0) {
        if (this.form.password !== value) {
          callBack([new Error('Password and Confirm Password must match!')]);
        } else {
          callBack();
        }
      } else {
        callBack();
      }
    },
    trigger: ['blur', 'change'],
  }],
  firstName: [{
    required: true,
    message: 'A First Name is required.',
    trigger: 'blur',
  }],
  lastName: [{
    required: true,
    message: 'A Last Name is required.',
    trigger: 'blur',
  }],
  mobile: [{
    required: true,
    message: 'A Mobile number is required.',
    trigger: 'blur',
  }, {
    pattern: /^01[0-2]{1}[0-9]{8}/,
    message: 'Please enter a valid Egyptian mobile number.',
    trigger: 'blur',
  }],
  gender: [{
    required: true,
    message: 'A Gender is required.',
    trigger: 'change',
  }, {
    type: 'enum',
    enum: ['Male', 'Female'],
    message: 'Please Choose a correct gender.',
    trigger: 'change',
  }],
  birthdate: [{
    type: 'date',
    message: 'Invalid Date format.',
    trigger: 'change',
  }],
};

export const clientLoginRules = {
  email: [{
    required: true,
    message: 'Please enter your email',
    trigger: 'blur',
  }],
  password: [{
    required: true,
    message: 'Please enter your password',
    trigger: 'blur',
  }],
};
