export default {

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

export const verifiedBusinessSignupRules = {
  password: [{
    required: true,
    message: 'Please enter your password',
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
    message: 'Please confirm your password',
    trigger: 'blur',
  }, {
    pattern: /^(?=.*\d).{8,15}$/,
    message: 'Password must be between 8 and 15 characters and contains at least one number.',
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
  description: [{
    required: true,
    message: 'Please enter a description for your business activity',
    trigger: 'blur',
  }],
  workingHours: [{
    required: true,
    messsage: 'Please enter your business working hours',
    trigger: 'blur',
  }],
  categoriesChoosed: [{
    validator(rule, value, callBack) {
      if (value.length === 0) {
        callBack([new Error('Please choose at least one category for your business')]);
      } else {
        callBack();
      }
    },
    trigger: 'blur',
  }],
  branchesEntered: [{
    validator(rule, value, callBack) {
      if (value.length === 0) {
        callBack([new Error('Please add at least one branch for your business')]);
      } else {
        callBack();
      }
    },
    trigger: 'blur',
  }],
};
