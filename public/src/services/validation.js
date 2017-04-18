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

export const serviceRules = {
  name: [{
    required: true,
    message: 'Please enter a name for your service',
    trigger: 'blur',
  }],
  shortDescription: [{
    required: true,
    message: 'Please enter a short description of your service',
    trigger: 'blur',
  }, {
    max: 140,
    message: 'The description can have a maximum 140 characters',
    trigger: 'blur',
  }],
};

export const offeringRules = {
  branch: [{
    required: true,
    message: 'Please select a branch for your offering',
    trigger: 'blur',
  }],
  price: [{
    required: true,
    message: 'Please enter a price for your offering',
    trigger: 'blur',
  }, {
    min: 0,
    message: 'The price cannot be lower than 0',
    trigger: 'blur',
  }],
  dates: [{
    required: true,
    message: 'Please enter a duration for your offering',
    trigger: 'blur',
  }, {
    type: 'array',
    len: 2,
    defaultField: {
      type: 'date',
      required: true,
    },
    message: 'Please enter a valid duration for your offering',
    trigger: 'blur',
  }],
  capacity: [{
    required: true,
    message: 'Please enter a capacity for your offering',
    trigger: 'blur',
  }, {
    min: 0,
    message: 'The capacity cannot be lower than 0',
    trigger: 'blur',
  }],
};

export default {
  serviceRules,
  offeringRules,
};
