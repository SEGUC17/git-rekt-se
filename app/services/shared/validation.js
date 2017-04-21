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
const businessValidationErrors = Strings.bussinessValidationErrors;

/**
 * Client validation.
 */

/**
 * Client Sign Up Validation Schema.
 */
const clientSignupValidation = {
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
      options: [/^01[0-2]{1}[0-9]{8}$/], // Egyptian Mobile phone
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

/**
 * Client Forgot Password Validation Schema.
 */
const forgotPasswordValidation = {
  email: {
    notEmpty: {
      errorMessage: clientValidationErrors.emailEmpty,
    },
    isEmail: {
      errorMessage: clientValidationErrors.invalidEmail,
    },
  },
};

/**
 * Client Edit Info Validation Schema.
 */
const clientUpdateValidation = {
  email: {
    notEmpty: {
      errorMessage: clientValidationErrors.emailEmpty,
    },
    isEmail: {
      errorMessage: clientValidationErrors.invalidEmail,
    },
  },
  password: {
    isPassword: {
      errorMessage: bussinessValidationErrors.invalidPassword,
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

/**
 * Client Confirm Email Validation Schema.
 */
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

/**
 * Client Reset Password Validation Schema.
 */
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

/**
 * Client Login Validation Schema.
 */
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

/**
 * Business Sign Up Validation Schema.
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
      options: [/^01[0-2]{1}[0-9]{8}$/], // Egyptian Mobile phone
      errorMessage: bussinessValidationErrors.invalidMobile,
    },
  },
  shortDescription: {
    notEmpty: {
      errorMessage: bussinessValidationErrors.emptyDescription,
    },
  },
};

/**
 * Verified Business Validation Schema.
 */
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

/**
 * Business Login Validation Schema.
 */
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
 * Business Reset Password Validation Schema.
 */
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
 * Business Edit Info Validation Schema.
 */
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

/**
 * Business Add Branches Validation Schema.
 */
const businessAddValidation = {
  branches: {
    notEmpty: {
      errorMessage: bussinessValidationErrors.branchesRequired,
    },
  },
};

/**
 * Business Edit Branches Validation Schema.
 */
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
 * Business Edit Image Validation Schema.
 */
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
 * Business Add Image Validation Schema.
 */
const businessAddImageValidation = {
  id: {
    isMongoId: {
      errorMessage: bussinessValidationErrors.invalidBusinessID,
    },
  },
};

/**
 * Business Edit Info Validation Schema.
 */
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

/**
 * Service CRUD Validation.
 */

/**
 * Create Service Validation Schema.
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

/**
 * Create Offering Validation Schema.
 */
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

/**
 * Create Service Validation Schema.
 */
const ServiceCreateValidationParams = {
  id: {
    isMongoId: {
      errorMessage: offeringValidationErrors.invalidServiceID,
    },
  },
};

/**
 * Edit Offering Validation Schema.
 */
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

/**
 * Add Image to Service Validation Schema.
 */
const serviceAddImageValidation = {
  id: {
    isMongoId: {
      errorMessage: serviceValidationErrors.invalidServiceID,
    },
  },
};

/**
 * Edit Service's Image Validation Schema.
 */
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

/**
 * Visitor Validation Schema.
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

/**
 * Review Validation.
 */

/**
 * Create Review Validation Schema.
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
  },
};

/**
 * Update Review Validation Schema.
 */
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

/**
 * Delete Review Validation Schema.
 */
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

/**
 * Admin Login Validation Schema.
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

/**
 * Admin Accept Business Validation Schema.
 */
const adminConfirmBusinessValidation = {
  id: {
    isMongoId: {
      errorMessage: adminValidationErrors.invalidBusinessID,
    },
  },
};

/**
 * Admin Accept Business Validation Schema.
 */
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

/**
 * Admin Client Validation Schema.
 */
const adminClientValidation = {
  id: {
    isMongoId: {
      errorMessage: adminValidationErrors.invalidClientID,
    },
  },
};

/**
 * Service Booking Validation Schema.
 */
const serviceBookingValidation = {
  service: {
    isMongoId: {
      errorMessage: serviceValidationErrors.invalidServiceID,
    },
  },
  offering: {
    isMongoId: {
      errorMessage: offeringValidationErrors.invalidOffering,
    },
  },
  token: {
    notEmpty: {
      errorMessage: serviceValidationErrors.invalidStripeToken,
    },
  },
};

/**
 * Checks the given password. If Empty or Can be generated
 * from the regex then it passes.
 * @param {String} password
 */
const validatePassword = (password) => {
  if (password.length === 0) {
    return true;
  }
  return /^(?=.*\d).{8,15}$/.test(password);
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
  validatePassword,
  clientUpdateValidation,
  adminClientValidation,
  forgotPasswordValidation,
  serviceBookingValidation,
};

module.exports = validation;
