/**
 * Express validator schema
 */

const clientSignupValidation = {
  email: {
    notEmpty: {
      errorMessage: 'Email is a required field.',
    },
    isEmail: {
      errorMessage: 'Invalid Email.',
    },
  },
  password: {
    notEmpty: {
      errorMessage: 'Password is a required field.',
    },
    matches: {
      options: [/^(?=.*\d).{8,15}$/],
      errorMessage: 'Password length must be between 8 and 15 and contains at least one number.',
    },
  },
  confirmPassword: {
    notEmpty: {
      errorMessage: 'Password Confirmation is a required field.',
    },
  },
  firstName: {
    notEmpty: {
      errorMessage: 'Firstname is a required field.',
    },
  },
  lastName: {
    notEmpty: {
      errorMessage: 'Firstname is a required field.',
    },
  },
  mobile: {
    notEmpty: {
      errorMessage: 'Mobile number is a required field.',
    },
    matches: {
      options: [/^01[0-2]{1}[0-9]{8}/], // Egyptian Mobile phone
      errorMessage: 'Invalid Mobile Number.',
    },
  },
  gender: {
    notEmpty: {
      errorMessage: 'Gender is a required field.',
    },
    matches: {
      options: [/^(Male|Female)$/],
    },
  },
  birthdate: {
    isDate: {
      errorMessage: 'Invalid birthdate',
    },
  },
};

const validation = {
  clientSignupValidation,
};

module.exports = validation;
