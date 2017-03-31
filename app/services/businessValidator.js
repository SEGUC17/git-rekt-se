const businessValidator = {
  password: {
    notEmpty: {
      errorMessage: 'Password is a required field.',
    },
    matches: {
      options: [/^(?=.*\d).{8,15}$/],
      errorMessage: 'Password length must be between 8 and 15 and contains at least one number.',
    },
  },
  workingHours: {
    notEmpty: {
      errorMessage: 'Working Hours is a required field.',
    },
  },
  categories: {
    notEmpty: {
      errorMessage: 'Must Include atleast 1 category.',
    },
  },
  branches: {
    notEmpty: {
      errorMessage: 'Must Include aleast 1 branch.',
    },
  },
};

module.exports = businessValidator;
