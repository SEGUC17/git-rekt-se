export const clientSignUpValidation = {
  email: [{
    required: true,
    message: 'Email is required.',
    trigger: 'blur',
  }, {
    type: 'email',
    message: 'Invalid Email format.',
    trigger: 'blur',
  }],
  password: [{
    required: true,
    message: 'Password is required.',
    trigger: 'blur',
  }, {
    pattern: /^(?=.*\d).{8,15}$/,
    message: 'Password must be 8-15 chars and contains at least one number.',
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
    message: 'Password Confirmation is required.',
    trigger: 'blur',
  }, {
    validator(rule, value, callBack) {
      if (!this.form.password) {
        callBack();
        return;
      }
      if (this.form.password.length > 0) {
        if (this.form.password !== value) {
          callBack([new Error('Password and password confirmation mismatch.')]);
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
    message: 'First Name is required.',
    trigger: 'blur',
  }],
  lastName: [{
    required: true,
    message: 'Last Name is required.',
    trigger: 'blur',
  }],
  mobile: [{
    required: true,
    message: 'Mobile number is required.',
    trigger: 'blur',
  }, {
    pattern: /^01[0-2][0-9]{8}$/,
    message: 'Mobile number must be 11 digits in the following format 01xxxxxxxxx.',
    trigger: 'blur',
  }],
  gender: [{
    required: true,
    message: 'Gender is required.',
    trigger: 'change',
  }, {
    type: 'enum',
    enum: ['Male', 'Female'],
    message: 'Please Choose a correct gender.',
    trigger: 'change',
  }],
  birthdate: [{
    required: true,
    message: 'Birthdate is required.',
    trigger: 'blur',
  }, {
    type: 'date',
    message: 'Invalid Date format.',
    trigger: 'change',
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
export const clientForgotPassword = {
  password: [{
    required: true,
    message: 'Password is required.',
    trigger: 'blur',
  }, {
    pattern: /^(?=.*\d).{8,15}$/,
    message: 'Password must be 8-15 chars and contains at least one number.',
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
    message: 'Password Confirmation is required.',
    trigger: 'blur',
  }, {
    validator(rule, value, callBack) {
      if (this.form.password.length > 0) {
        if (this.form.password !== value) {
          callBack([new Error('Password and password confirmation mismatch.')]);
        } else {
          callBack();
        }
      } else {
        callBack();
      }
    },
    trigger: ['blur', 'change'],
  }],
};

export const clientForgotPasswordMail = {
  email: [{
    required: true,
    message: 'Email is required.',
    trigger: 'blur',
  },
  {
    type: 'email', message: 'Please input correct email address', trigger: 'blur,change',
  },
  ],
};

export const serviceRules = {
  name: [{
    required: true,
    message: 'Please enter a name for your service',
    trigger: ['blur', 'change'],
  }],
  shortDescription: [{
    required: true,
    message: 'Please enter a short description of your service',
    trigger: ['blur', 'change'],
  }, {
    max: 140,
    message: 'The description can have a maximum 140 characters',
    trigger: ['blur', 'change'],
  }],
};

export const offeringRules = {
  branch: [{
    required: true,
    message: 'Please select a branch for your offering',
    trigger: ['blur', 'change'],
  }],
  price: [{
    type: 'number',
    message: 'Price must be a number',
    trigger: ['blur', 'change'],
  }, {
    type: 'number',
    required: true,
    message: 'Please enter a price for your offering',
    trigger: ['blur', 'change'],
  }, {
    type: 'number',
    min: 0,
    message: 'The price cannot be lower than 0',
    trigger: ['blur', 'change'],
  }],
  dates: [{
    type: 'array',
    required: true,
    message: 'Please enter a duration for your offering',
    trigger: ['blur', 'change'],
  }, {
    type: 'array',
    len: 2,
    defaultField: {
      type: 'date',
      required: true,
    },
    message: 'Please enter a valid duration for your offering',
    trigger: ['blur', 'change'],
  }],
  capacity: [{
    type: 'number',
    required: true,
    message: 'Please enter a capacity for your offering',
    trigger: ['blur', 'change'],
  }, {
    type: 'number',
    min: 0,
    message: 'The capacity cannot be lower than 0',
    trigger: ['blur', 'change'],
  }],
};

export default {
  serviceRules,
  offeringRules,
};
