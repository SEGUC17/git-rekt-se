/**
 * Express validator schema.
 */

const locations = require('../../seed/service/locations');

const Strings = require('./Strings');

const clientValidationErrors = Strings.clientValidationErrors;
const bussinessValidationErrors = Strings.bussinessValidationErrors;
const serviceValidationErrors = Strings.serviceValidationErrors;
const serviceValidationCRUDErrors = Strings.serviceValidationCRUDErrors;
const offeringValidationErrors = Strings.offeringValidationError;
const adminValidationErrors = Strings.adminValidationErrors;
const visitorValidationErrors = Strings.visitorValidationErrors;
const reviewErrors = Strings.reviewErrors;

/**
 * Client validation.
 */

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
  description: {
    notEmpty: {
      errorMessage: businessValidationErrors.emptyDescription,
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
 * Business validation.
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

/**
 * Service CRUD Validation.
 */

const serviceCreateValidation = {
  name: {
    notEmpty: {
      errorMessage: serviceValidationCRUDErrors.emptyName,
    },
  },
  shortDescription: {
    notEmpty: {
      errorMessage: serviceValidationCRUDErrors.emptyShortDescription,
    },
  },
};

const offeringCreateValidationBody = {
  price: {
    notEmpty: {
      errorMessage: offeringValidationErrors.emptyPrice,
    },
  },
  startDate: {
    notEmpty: {
      errorMessage: offeringValidationErrors.emptyStartDate,
    },
  },
  endDate: {
    notEmpty: {
      errorMessage: offeringValidationErrors.emptyEndDate,
    },
  },
  branch: {
    isMongoId: {
      errorMessage: offeringValidationErrors.invalidBranchID,
    },
  },
};

const ServiceCreateValidationParams = {
  id: {
    isMongoId: {
      errorMessage: offeringValidationErrors.invalidServiceID,
    },
  },
};


const offeringEditValidationParmas = {
  id1: {
    isMongoId: {
      errorMessage: offeringValidationErrors.invalidServiceID,
    },
  },
  id2: {
    isMongoId: {
      errorMessage: offeringValidationErrors.invalidOfferingID,
    },
  },
};
const businessResetPasswordValidation = {
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

/**
 * Visitor validation.
 */

const visitorValidation = {
  id: {
    isMongoId: {
      errorMessage: visitorValidationErrors.InvalidID,
    },
  },
  offset: {
    isInt: {
      options: {
        min: 1,
      },
      errorMessage: visitorValidationErrors.InvalidOffset,
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

const businessAddValidation = {
  branches: {
    notEmpty: {
      errorMessage: bussinessValidationErrors.branchesRequired,
    },
  },
};

const businessEditValidation = {
  'branch.location': {
    notEmpty: {
      errorMessage: bussinessValidationErrors.locationRequired,
    },
    isIn: {
      options: [locations],
      errorMessage: bussinessValidationErrors.locationInvalid,
    },
  },
  'branch.address': {
    notEmpty: {
      errorMessage: bussinessValidationErrors.addressRequired,
    },
  },
};

/**
 * Review Validation.
 */

const createReviewValidation = {
  id: { in: 'params',
    isMongoId: {
      errorMessage: reviewErrors.invalidService,
    },
  },
  rating: { in: 'body',
    notEmpty: {
      errorMessage: reviewErrors.emptyRating,
    },
    matches: {
      options: '[0-4]',
      errorMessage: reviewErrors.outOfRangeRating,
    },
  },
};

const updateReviewValidation = {
  id: { in: 'params',
    isMongoId: {
      errorMessage: reviewErrors.invalidService,
    },
  },
  review_id: { in: 'params',
    isMongoId: {
      errorMessage: reviewErrors.invalidReview,
    },
  },
  rating: { in: 'body',
    notEmpty: {
      errorMessage: reviewErrors.emptyRating,
    },
  },
};

const deleteReviewValidation = {
  id: { in: 'params',
    isMongoId: {
      errorMessage: reviewErrors.invalidService,
    },
  },
  review_id: { in: 'params',
    isMongoId: {
      errorMessage: reviewErrors.invalidReview,
    },
  },
};

/**
 * Administrator validation.
 */

const adminLoginValidation = {
  email: {
    notEmpty: {
      errorMessage: adminValidationErrors.emptyEmail,
    },
    isEmail: {
      errorMessage: adminValidationErrors.invalidEmail,
    },
  },
  password: {
    notEmpty: {
      errorMessage: adminValidationErrors.emptyPassword,
    },
    matches: {
      options: [/^(?=.*\d).{8,15}$/],
      errorMessage: adminValidationErrors.invalidPassword,
    },
  },
};

const businessAddImageValidation = {
  id: {
    isMongoId: {
      errorMessage: bussinessValidationErrors.invalidBusinessID,
    },
  },
};

const businessEditImageValidation = {
  ser_id: {
    isMongoId: {
      errorMessage: bussinessValidationErrors.invalidBusinessID,
    },
  },
  im_id: {
    isMongoId: {
      errorMessage: bussinessValidationErrors.invalidBusinessID,
    },
  },
};

/**
 * Client validation.
 */

const serviceAddImageValidation = {
  id: {
    isMongoId: {
      errorMessage: serviceValidationErrors.invalidServiceID,
    },
  },
};

const serviceEditImageValidation = {
  ser_id: {
    isMongoId: {
      errorMessage: serviceValidationErrors.invalidServiceID,
    },
  },
  im_id: {
    isMongoId: {
      errorMessage: serviceValidationErrors.invalidImageID,
    },
  },
};

const adminConfirmBusinessValidation = {
  id: {
    isMongoId: {
      errorMessage: adminValidationErrors.invalidBusinessID,
    },
  },
};

const adminCategoryValidation = {
  type: {
    notEmpty: {
      errorMessage: adminValidationErrors.categoryTypeRequired,
    },
  },
  title: {
    notEmpty: {
      errorMessage: adminValidationErrors.categoryTitleRequired,
    },
  },
};

const businessUpdateValidation = {
  name: {
    notEmpty: {
      errorMessage: bussinessValidationErrors.emptyName,
    },
  },
  shortDescription: {
    notEmpty: {
      errorMessage: bussinessValidationErrors.emptyDescription,
    },
  },
  phoneNumbers: {
    notEmpty: {
      errorMessage: bussinessValidationErrors.emptyMobile,
    },
  },
};

const validation = {
  clientResetPasswordValidation,
  clientSignupValidation,
  clientConfirmEmailValidation,
  verifiedBusinessValidator,
  clientLoginValidation,
  adminLoginValidation,
  businessSignupValidation,
  businessLoginValidation,

  serviceCreateValidation,
  offeringCreateValidationBody,
  ServiceCreateValidationParams,
  offeringEditValidationParmas,
  businessResetPasswordValidation,
  visitorValidation,
  businessEditInfoValidation,
  adminConfirmBusinessValidation,
  businessAddValidation,
  businessEditValidation,
  serviceAddImageValidation,
  serviceEditImageValidation,
  createReviewValidation,
  updateReviewValidation,
  deleteReviewValidation,
  businessUpdateValidation,
  businessAddImageValidation,
  businessEditImageValidation,
  adminCategoryValidation,
};

module.exports = validation;
