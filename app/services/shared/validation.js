/**
 * Express validator schema
 */
const clientValidationErrors = require('./Strings')
  .clientValidationErrors;

const businessValidationErrors = require('../shared/Strings')
  .bussinessValidationErrors;

const clientSignupValidation = {
  email: {
    notEmpty: {
      errorMessage: clientValidationErrors.emailEmpty,
    },
    isEmail: {
      errorMessage: clientValidationErrors.invalidEmail,
    },
  },
  password: {
    notEmpty: {
      errorMessage: clientValidationErrors.emptyPassword,
    },
    matches: {
      options: [/^(?=.*\d).{8,15}$/],
      errorMessage: clientValidationErrors.emptyPassword,
    },
  },
  confirmPassword: {
    notEmpty: {
      errorMessage: clientValidationErrors.emptyConfirmation,
    },
  },
  firstName: {
    notEmpty: {
      errorMessage: clientValidationErrors.emptyFirstName,
    },
  },
  lastName: {
    notEmpty: {
      errorMessage: clientValidationErrors.emptyLastName,
    },
  },
  mobile: {
    notEmpty: {
      errorMessage: clientValidationErrors.emptyMobile,
    },
    matches: {
      options: [/^01[0-2]{1}[0-9]{8}/], // Egyptian Mobile phone
      errorMessage: clientValidationErrors.invalidMobile,
    },
  },
  gender: {
    notEmpty: {
      errorMessage: clientValidationErrors.emptyGender,
    },
    matches: {
      options: [/^(Male|Female)$/],
      errorMessage: clientValidationErrors.invalidGender,
    },
  },
  birthdate: {
    isDate: {
      errorMessage: clientValidationErrors.invalidBirthdate,
    },
  },
};

const clientConfirmEmailValidation = {
  email: {
    notEmpty: {
      errorMessage: clientValidationErrors.emailEmpty,
    },
    isEmail: {
      errorMessage: clientValidationErrors.invalidEmail,
    },
  },
};

const verifiedBusinessValidator = {
  password: {
    notEmpty: {
      errorMessage: businessValidationErrors.passwordRequired,
    },
    matches: {
      options: [/^(?=.*\d).{8,15}$/],
      errorMessage: businessValidationErrors.passwordLength,
    },
  },
  workingHours: {
    notEmpty: {
      errorMessage: businessValidationErrors.workingHoursRequired,
    },
  },
  categories: {
    notEmpty: {
      errorMessage: businessValidationErrors.categoriesRequired,
    },
  },
  branches: {
    notEmpty: {
      errorMessage: businessValidationErrors.branchesRequired,
    },
  },
};

const validation = {
  clientSignupValidation,
  clientConfirmEmailValidation,
  verifiedBusinessValidator,
};

module.exports = validation;
