export default {

};

export const businessEditInfoValidation = {
  name: [{
    required: true,
    message: 'Please Enter a name!',
    trigger: ['blur', 'change'],
  }],
  email: [{
    required: true,
    message: 'Please Enter an email!',
    trigger: ['blur', 'change'],
  }, {
    type: 'email',
    message: 'Must be a valid email!',
    trigger: ['blur', 'change'],
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
    trigger: ['blur', 'change'],
  }],
  confirmPassword: [{
    validator(rule, value, callBack) {
      if (value === '***************') {
        callBack();
      } else if (value === this.form.password) {
        callBack();
      } else {
        callBack([new Error('Password and Confirm Password must match!')]);
      }
    },
    trigger: ['blur', 'change'],
  }],
  shortDescription: [{
    required: true,
    message: 'Please Enter a Short Description!',
    trigger: ['blur', 'change'],
  }],
};
