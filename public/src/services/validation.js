export default {

};

export const businessEditInfoValidation = {
  name: [{
    required: true,
    message: 'A Name is required.',
    trigger: ['blur', 'change'],
  }],
  email: [{
    required: true,
    message: 'An Email is required.',
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
      } else if (value.length === 0 && this.form.password.length === 0) {
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
    message: 'A Short Description is required.',
    trigger: ['blur', 'change'],
  }],
  phoneNumber: [{
    validator(rule, value, callBack) {
      console.log(value);
      if (/^01[0-2]{1}[0-9]{8}/.test(value)) {
        callBack();
      } else {
        callBack([new Error('Phone Number must be in this format 01xxxxxxxxx')]);
      }
    },
    trigger: ['blur', 'change'],
  }],
};

export const loginRules = {
  email: [{
    required: true,
    message: 'Email is required.',
    trigger: 'blur',
  }],
  password: [{
    required: true,
    message: 'Password is required.',
    trigger: 'blur',
  }],
};
