/**
 * Express validator schema
 */
const Strings = require('./Strings');

const clientValidationErrors = Strings.clientValidationErrors;
const bussinessValidationErrors = Strings.bussinessValidationErrors;


/**
 * Client validation
 */

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
      errorMessage: clientValidationErrors.invalidPassword,
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


const clientLoginValidation = {
  email: {
    notEmpty: {
      errorMessage: clientValidationErrors.emptyEmail,
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
      errorMessage: clientValidationErrors.invalidPassword,
    },
  },
};

/**
 * Business validation
 */

const businessSignupValidation = {
  email: {
    notEmpty: {
      errorMessage: bussinessValidationErrors.emptyEmail,
    },
    isEmail: {
      errorMessage: bussinessValidationErrors.invalidEmail,
    },
  },
  name: {
    notEmpty: {
      errorMessage: bussinessValidationErrors.emptyName,
    },
  },
  mobile: {
    notEmpty: {
      errorMessage: bussinessValidationErrors.emptyMobile,
    },
    matches: {
      options: [/^01[0-2]{1}[0-9]{8}/], // Egyptian Mobile phone
      errorMessage: bussinessValidationErrors.invalidMobile,
    },
  },
  shortDescription: {
    notEmpty: {
      errorMessage: bussinessValidationErrors.emptyDescription,
    },
  },
};

const clientResetPasswordValidation = {
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
};

const businessLoginValidation = {
  email: {
    notEmpty: {
      errorMessage: bussinessValidationErrors.emptyEmail,
    },
    isEmail: {
      errorMessage: bussinessValidationErrors.invalidEmail,
    },
  },
  password: {
    notEmpty: {
      errorMessage: bussinessValidationErrors.emptyPassword,
    },
    matches: {
      options: [/^(?=.*\d).{8,15}$/],
      errorMessage: bussinessValidationErrors.invalidPassword,
    },
  },
};

const businessEditInfoValidation = {
  workingHours: {
    notEmpty: {
      errorMessage: bussinessValidationErrors.workingHoursRequired,
    },
  },
  description: {
    notEmpty: {
      errorMessage: bussinessValidationErrors.emptyConfirmation,
    },
  },
  categories: {
    notEmpty: {
      errorMessage: bussinessValidationErrors.categoriesRequired,
    },
  },
};

const validation = {
  clientResetPasswordValidation,
  clientSignupValidation,
  clientConfirmEmailValidation,
  clientLoginValidation,
  businessSignupValidation,
  businessLoginValidation,
  businessEditInfoValidation,
};

module.exports = validation;
