export default {

};

// TODO Custom Validation for confirmPassword
export const clientSignUpValidation = {
  email: [{
    required: true,
    message: 'Please Enter a valid email.',
    trigger: 'blur',
  }, {
    type: 'email',
    message: 'Must be an email.',
    trigger: 'blur',
  }],
  password: [{
    required: true,
    message: 'Please Enter a password.',
    trigger: 'blur',
  }, {
    pattern: /^(?=.*\d).{8,15}$/,
    message: 'Password must be between 8 and 15 characters and contains at least one number.',
    trigger: 'blur',
  }],
  firstName: [{
    required: true,
    message: 'Please Enter your first name.',
    trigger: 'blur',
  }],
  lastName: [{
    required: true,
    message: 'Please Enter your last name.',
    trigger: 'blur',
  }],
  mobile: [{
    required: true,
    message: 'Please Enter a mobile number.',
    trigger: 'blur',
  }, {
    pattern: /^01[0-2]{1}[0-9]{8}/,
    message: 'Please enter a valid Egyptian mobile number.',
    trigger: 'blur',
  }],
  gender: [{
    required: true,
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
