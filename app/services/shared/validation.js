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
const couponValidationErrors = Strings.couponValidationError;
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
 * Client Update Info Validation Schema.
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
 * Client forgot password Validation Schema.
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
 * Client confirm email Validation Schema.
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
 * Client login Validation Schema.
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
 * Client reset password Validation Schema.
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
 * Business Edit Info Validation.
 */
const businessUpdateValidation = {
  name: {
    notEmpty: {
      errorMessage: bussinessValidationErrors.emptyName,
    },
  },
  email: {
    isEmail: {
      errorMessage: bussinessValidationErrors.invalidEmail,
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
    arePhoneNumbers: {
      errorMessage: bussinessValidationErrors.invalidMobile,
    },
  },
  password: {
    isPassword: {
      errorMessage: bussinessValidationErrors.invalidPassword,
    },
  },
};

/**
 * Business Edit Image Validation Schema.
 */
const businessEditImageValidation = {
  im_id: {
    isMongoId: {
      errorMessage: bussinessValidationErrors.invalidBusinessID,
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
 * Business Add Branch Validation Schema.
 */
const businessAddValidation = {
  branches: {
    notEmpty: {
      errorMessage: bussinessValidationErrors.branchesRequired,
    },
  },
};

/**
 * Business Edit Branch Validation Schema.
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
 * Create Service Validation Schema.
 */

const serviceCreateValidation = {
  name: {
    notEmpty: {
      errorMessage: serviceValidationCRUDErrors.emptyName,
    },
    isLength: {
      options: {
        max: 50,
      },
      errorMessage: serviceValidationCRUDErrors.nameTooLong,
    },
  },
  shortDescription: {
    notEmpty: {
      errorMessage: serviceValidationCRUDErrors.emptyShortDescription,
    },
    isLength: {
      options: {
        max: 140,
      },
      errorMessage: serviceValidationCRUDErrors.shortDescriptionTooLong,
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
  capacity: {
    notEmpty: {
      errorMessage: offeringValidationErrors.emptyCapacity,
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
 * Coupon Validation Schema.
 */
const couponGetValidation = {
  id: {
    in: 'params',
    isMongoId: {
      errorMessage: serviceValidationErrors.invalidServiceID,
    },
  },
};

/**
 * Add Coupon Validation Schema.
 */
const couponAddValidation = {
  id: {
    in: 'params',
    isMongoId: {
      errorMessage: serviceValidationErrors.invalidServiceID,
    },
  },
  code: {
    in: 'body',
    notEmpty: {
      errorMessage: couponValidationErrors.emptyCode,
    },
  },
  discount: {
    in: 'body',
    notEmpty: {
      errorMessage: couponValidationErrors.emptyValue,
    },
    matches: {
      options: [/^0*(100|[1-9][0-9]|[1-9])$/],
      errorMessage: couponValidationErrors.invalidValue,
    },
  },
  startDate: {
    in: 'body',
    notEmpty: {
      errorMessage: couponValidationErrors.emptyStartDate,
    },
    isDate: {
      errorMessage: couponValidationErrors.invalidDateFormat,
    },
  },
  endDate: {
    in: 'body',
    notEmpty: {
      errorMessage: couponValidationErrors.emptyEndDate,
    },
    isDate: {
      errorMessage: couponValidationErrors.invalidDateFormat,
    },
  },
};

/**
 * Delete Coupon Validation Schema.
 */
const couponDeleteValidation = {
  ser_id: {
    in: 'params',
    isMongoId: {
      errorMessage: serviceValidationErrors.invalidServiceID,
    },
  },
  coup_id: {
    in: 'params',
    isMongoId: {
      errorMessage: couponValidationErrors.invalidCouponID,
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

const relatedBusinessValidation = {
  id: {
    isMongoId: {
      errorMessage: visitorValidationErrors.InvalidID,
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
  id: {
    in: 'params',
    isMongoId: {
      errorMessage: reviewErrors.invalidService,
    },
  },
  rating: {
    in: 'body',
    notEmpty: {
      errorMessage: reviewErrors.emptyRating,
    },
    isInt: {
      options: [{
        min: 1,
        max: 5,
      }],
      errorMessage: reviewErrors.outOfRangeRating,
    },
  },
  description: {
    in: 'body',
    optional: true,
    isLength: {
      options: [{ min: 0, max: 512 }],
      errorMessage: reviewErrors.descriptionTooLong,
    },
  },
};

/**
 * Update Review Vaidation Schema.
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
    isInt: {
      options: [{
        min: 1,
        max: 5,
      }],
      errorMessage: reviewErrors.outOfRangeRating,
    },
  },
  description: { in: 'body',
    optional: true,
    isLength: {
      options: [{ min: 0, max: 512 }],
      errorMessage: reviewErrors.descriptionTooLong,
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
 * Admin Delete client Validation Schema.
 */
const adminClientValidation = {
  id: {
    isMongoId: {
      errorMessage: adminValidationErrors.invalidClientID,
    },
  },
};

/**
 * Admin Confirm Business Validation Schema.
 */
const adminConfirmBusinessValidation = {
  id: {
    isMongoId: {
      errorMessage: adminValidationErrors.invalidBusinessID,
    },
  },
};

/**
 * Admin Category Validation Schema.
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
 * Delete Client Review Validation Schema.
 */
const clientReviewValidation = {
  id: {
    isMongoId: {
      errorMessage: adminValidationErrors.invalidReviewID,
    },
  },
};

/**
 * Delete Business Validation Schema.
 */
const businessdeletionValidation = {
  id: {
    isMongoId: {
      errorMessage: adminValidationErrors.invalidBusinessID,
    },
  },
};

const serviceViewGalleryValidation = {
  id: {
    isMongoId: {
      errorMessage: serviceValidationErrors.invalidServiceID,
    },
  },
};

const serviceAddImageValidation = {
  id: {
    isMongoId: {
      errorMessage: serviceValidationErrors.invalidServiceID,
    },
  },
};

/**
 * Edit Service Image Validation Schema.
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

/**
 * Checks if the given Array of Phone Numbers contain numbers in the
 * Egyptian phone number format.
 * @param {Array} phoneNumber
 */
const validatePhoneNumber = (phoneNumbers) => {
  const valid = phoneNumbers.filter(phoneNumber => /^01[0-2]{1}[0-9]{8}/.test(phoneNumber));
  return valid.length === phoneNumbers.length;
};

/**
 * Client Book Service Validation Schema.
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
  validatePassword,
  validatePhoneNumber,
  businessEditImageValidation,
  adminCategoryValidation,
  clientUpdateValidation,
  adminClientValidation,
  businessdeletionValidation,
  forgotPasswordValidation,
  serviceBookingValidation,
  clientReviewValidation,
  serviceViewGalleryValidation,
  couponAddValidation,
  couponDeleteValidation,
  couponGetValidation,
  relatedBusinessValidation,
};

module.exports = validation;
