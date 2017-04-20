export default {

};

export const clientEditInfoValidation = {
  email: [{
    message: 'Please Enter a valid email.',
    trigger: 'blur',
  }, {
    type: 'email',
    message: 'Must be an email.',
    trigger: 'blur',
  }],
  password: [{
    validator(rule, value, callBack) {
      if (value === '***************') {
        callBack();
      } else if (/^(?=.*\d).{8,15}$/.test(value)) {
        callBack();
      } else {
        callBack([new Error('Password must be between 8 and 15 characters and contains at least one number!')]);
      }
    },
    trigger: 'blur',
  }],
  confirmPassword: [{
    validator(rule, value, callBack) {
      if (value === '***************') {
        callBack();
      } else if (value.length === 0 && this.form.password.length === 0) {
        callBack();
      } else if (value === this.form.password) {
        callBack();
      } else {
        callBack([new Error('Password and Confirm Password must match!')]);
      }
    },
    trigger: 'blur',
  }],
  firstName: [{
    message: 'Please Enter your first name.',
    trigger: 'blur',
  }],
  lastName: [{
    message: 'Please Enter your last name.',
    trigger: 'blur',
  }],
  mobile: [{
    message: 'Please Enter a mobile number.',
    trigger: 'blur',
  }, {
    pattern: /^01[0-2]{1}[0-9]{8}/,
    message: 'Please enter a valid Egyptian mobile number.',
    trigger: 'blur',
  }],
  gender: [{
    message: 'Please Choose a gender',
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
