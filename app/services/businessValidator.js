const errorMessages = require('../services/shared/Constants')
  .validatorErrors;

const businessValidator = {
  password: {
    notEmpty: {
      errorMessage: errorMessages.passwordRequired,
    },
    matches: {
      options: [/^(?=.*\d).{8,15}$/],
      errorMessage: errorMessages.passwordLength,
    },
  },
  workingHours: {
    notEmpty: {
      errorMessage: errorMessages.workingHoursRequired,
    },
  },
  categories: {
    notEmpty: {
      errorMessage: errorMessages.categoriesRequired,
    },
  },
  branches: {
    notEmpty: {
      errorMessage: errorMessages.branchesRequired,
    },
  },
};

module.exports = businessValidator;
