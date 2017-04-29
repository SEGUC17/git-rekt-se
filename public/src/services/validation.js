
/**
 * This contains the Front-End Validation Rules.
 */

/*
 * Client Side Form Validation Schemas.
 * Async-validator.
 * https://github.com/yiminghe/async-validator
 * */

export const businessEditInfoValidation = {
  name: [{
    required: true,
    message: 'A Business Name is required.',
    trigger: 'blur',
  }],
  email: [{
    required: true,
    message: 'An Email is required.',
    trigger: 'blur',
  }, {
    type: 'email',
    message: 'Must be an email',
    trigger: 'blur',
  }],
  password: [{
    validator(rule, value, callBack) {
      if (value === '***************') {
        callBack();
      } else if (/^(?=.*\d).{8,15}$/.test(value)) {
        this.$refs.form.validateField('confirmPassword');
      } else {
        callBack([new Error('Password must be between 8 and 15 characters and contains at least one number!')]);
      }
      callBack();
    },
    trigger: 'blur',
  }],
  confirmPassword: [{
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
    trigger: 'blur',
  }],
  shortDescription: [{
    required: true,
    message: 'A Short Description is required.',
    trigger: 'blur',
  }],
  phoneNumber: [{
    validator(rule, value, callBack) {
      if (/^01[0-2]{1}[0-9]{8}/.test(value)) {
        callBack();
      } else {
        callBack([new Error('Phone Number must be in this format 01xxxxxxxxx')]);
      }
    },
    trigger: 'blur',
  }],
};

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
    type: 'date',
    message: 'Invalid Date format.',
    required: true,
    trigger: 'change',
  }, {
    validator(rule, value, callBack) {
      if (this.form.birthdate) {
        if (new Date(this.form.birthdate) >= Date.now()) {
          callBack([new Error('Please enter a valid birthdate')]);
        } else {
          callBack();
        }
      }
    },
    trigger: 'change',
  }],
};

/**
 * Login Rules.
 */
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

/**
 * Client Forgot Password Rules.
 */
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

/**
 * Verified Business Sign Up Rules.
 */
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
  categories: [{
    validator(rule, value, callBack) {
      if (value.length === 0) {
        callBack([new Error('Please choose at least one category for your business')]);
      } else {
        callBack();
      }
    },
    trigger: 'blur',
  }],
  branches: [{
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

/**
 * Category Rules.
 */
export const categoryRules = {
  type: [{
    required: true,
    message: 'type is required.',
    trigger: 'blur',
  }],
  title: [{
    required: true,
    message: 'title is required.',
  }],
};

/**
 * Client Forgot Password Mail Rules.
 */
export const clientForgotPasswordMail = {
  email: [{
    required: true,
    message: 'Email is required.',
    trigger: 'blur',
  },
  {
    type: 'email',
    message: 'Please input correct email address',
    trigger: 'blur,change',
  },
  ],
};

/**
 * Unverified Business SignUp Rules.
 */
export const businessAddCoupon = {
  code: [{
    required: true,
    message: 'Please input Coupon Code',
    trigger: 'blur',
  }],
  discount: [{
    type: 'number',
    required: true,
    message: 'Please input Discount Value',
    trigger: 'change',
  }],
  startDate: [{
    type: 'date',
    required: true,
    message: 'Please pick a Start date',
    trigger: 'change',
  }],
  endDate: [{
    type: 'date',
    required: true,
    message: 'Please pick an End date',
    trigger: 'change',
  }],
};

export const unverfiedBusinessSignupValidation = {

  name: {
    required: true,
    message: 'Name is required.',
    trigger: 'blur',
  },
  email: [{
    required: true,
    message: 'Email is required.',
    trigger: 'blur',
  }, {
    type: 'email',
    message: 'Invalid Email format.',
    trigger: 'blur',
  }],
  shortDescription: {
    required: true,
    message: 'Short description is required.',
    trigger: 'blur',
  },
  mobile: [{
    required: true,
    message: 'Mobile number is required.',
    trigger: 'blur',
  }, {
    pattern: /^01[0-2][0-9]{8}$/,
    message: 'Mobile number must be 11 digits in the following format 01xxxxxxxxx.',
  }],
};

/**
 * Client Edit Information Rules.
 */
export const clientEditInfoValidation = {
  email: [{
    message: 'Please Enter a valid email.',
    required: true,
    trigger: 'change',
  }, {
    type: 'email',
    message: 'Must be an email.',
    trigger: 'change',
  }],
  firstName: [{
    message: 'First name is required.',
    trigger: 'change',
    required: true,
  }],
  lastName: [{
    message: 'Last name is required.',
    trigger: 'change',
    required: true,
  }],
  mobile: [{
    message: 'Mobile number is required.',
    trigger: 'change',
    required: true,
  }, {
    pattern: /^01[0-2]{1}[0-9]{8}$/,
    message: 'Please enter a valid Egyptian mobile number.',
    trigger: 'change',
  }],
  gender: [{
    message: 'Gender is required.',
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
    required: true,
    trigger: 'change',
  }, {
    validator(rule, value, callBack) {
      if (this.form.birthdate) {
        if (new Date(this.form.birthdate) >= Date.now()) {
          callBack([new Error('Please enter a valid birthdate')]);
        } else {
          callBack();
        }
      }
    },
    trigger: 'change',
  }],
  password: [{
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
    validator(rule, value, callBack) {
      if (this.form.password && this.form.confirmPassword) {
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

/**
 * Forgot Password Validation Rules.
 */
export const forgotPasswordValidation = {
  email: [{
    required: true,
    message: 'Please Enter a valid email.',
    trigger: 'blur',
  }, {
    type: 'email',
    message: 'Must be an email.',
    trigger: 'blur',
  }],
};

/**
 * Business Reset Password Rules.
 */
export const serviceRules = {
  name: [{
    required: true,
    message: 'Please enter a name for your service',
    trigger: 'blur',
  }, {
    max: 50,
    message: 'The service name can have a maximum 50 characters',
    trigger: 'change',
  }],
  shortDescription: [{
    required: true,
    message: 'Please enter a short description of your service',
    trigger: 'blur',
  }, {
    max: 140,
    message: 'The short description can have a maximum 140 characters',
    trigger: 'change',
  }],
};

export const offeringRules = {
  branch: [{
    required: true,
    message: 'Please select a branch for your offering',
    trigger: 'blur',
  }],
  price: [{
    type: 'number',
    message: 'Price must be a number',
    trigger: 'change',
  }, {
    type: 'number',
    required: true,
    message: 'Please enter a price for your offering',
    trigger: 'blur',
  }, {
    type: 'number',
    min: 0,
    message: 'The price cannot be lower than 0',
    trigger: 'change',
  }],
  dates: [{
    type: 'array',
    required: true,
    message: 'Please enter a duration for your offering',
    trigger: 'blur',
  }, {
    type: 'array',
    len: 2,
    defaultField: {
      type: 'date',
      required: true,
      message: 'Please enter a duration for your offering',
    },
    message: 'Please enter a valid duration for your offering',
    trigger: 'blur',
  }],
  capacity: [{
    type: 'number',
    required: true,
    message: 'Please enter a capacity for your offering',
    trigger: 'blur',
  }, {
    type: 'number',
    min: 0,
    message: 'The capacity cannot be lower than 0',
    trigger: 'change',
  }],
};

export const BusinessResetFormValidation = {
  password: [{
    required: true,
    message: 'Please Enter a password.',
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
  }],
};

export const infoFormRules = {
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
  categories: [{
    validator(rule, value, callBack) {
      if (value.length === 0) {
        callBack([new Error('Please choose at least one category for your business')]);
      } else {
        callBack();
      }
    },
    trigger: 'blur',
  }],
};

export const branchesFormRules = {
  branches: [{
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


export const reviewRules = {
  rating: [{
    type: 'number',
    required: true,
    message: 'Please enter a rating',
    trigger: 'blur',
  }, {
    type: 'number',
    min: 1,
    max: 5,
    message: 'Rating can only be a value between 1 & 5',
    trigger: 'change',
  }],
  description: {
    max: 512,
    message: 'A review can have at maximum 512 characters.',
    trigger: 'change',
  },
};
