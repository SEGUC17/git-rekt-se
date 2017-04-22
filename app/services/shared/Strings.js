/**
 * Constant Strings.
 */
const locations = require('../../seed/service/locations')
  .join(', ');

/**
 *  General Strings.
 */
const generalErrors = {
  mailerError: 'An issue occured while sending the email.',
  generalError: 'An error occurred trying to handle this request.',
};

/**
 * Business Validation Errors Strings.
 */
const bussinessValidationErrors = {
  emptyEmail: 'Email is a required field.',
  invalidEmail: 'Invalid Email.',
  emptyPassword: 'Password is a required field.',
  invalidPassword: 'Password length must be between 8 and 15 and contains at least one number.',
  emptyName: 'Name is a required field.',
  emptyMobile: 'Mobile is a required field.',
  emptyDescription: 'Description is a required field.',
  invalidMobile: 'Mobile must be in this format 01xxxxxxxxx',
  passwordRequired: 'Password is a required field.',
  passwordLength: 'Password length must be between 8 and 15 and contains at least one number.',
  passwordMismatch: 'Password and Password Confirmation must match.',
  workingHoursRequired: 'Working Hours is a required field.',
  categoriesRequired: 'Must Include atleast 1 category.',
  branchesRequired: 'Must Include aleast 1 branch.',
  businessExists: 'Business already exists.',
  invalidBusinessId: 'The required id is invalid.',
  locationRequired: 'Location is a required field',
  addressRequired: 'Address is a required field',
  locationInvalid: `Invalid location. Must be any of [${locations}]`,
};

/**
 * Business Success Messages.
 */
const businessSuccess = {
  unverifiedSignup: 'Signup Successful, A representative will contact you soon.',
  emailConfirmation: 'Please check your email for the email confirmation.',
  infoEditSuccess: 'Info Edited Successfully',
  branchAddedSuccess: 'Branch Added Successfully',
  branchEditSuccess: 'Branch Edited Successfully',
  branchDeleteSuccess: 'Branch Deleted Successfully',
  logout: 'You have been logged out.',
};

/**
 * Business Login Messages.
 */
const businessLoginMessages = {
  invalidCreds: 'Invalid Credentials.',
  loginSuccess: 'Business Login Success.',
  pendingVerification: 'You have not been confirmed by the admin.',
  removeBusiness: 'This business has been removed.',
  invalidToken: 'Invalid Token',
};

/**
 * Admin Response Messages.
 */
const businessConfirmation = {
  alreadyConfirmed: 'Business was already confirmed.',
  notFound: 'Business not found.',
  confirmed: 'Business confirmed successfully!',
  denied: 'Business request denied.',
  alreadyDenied: 'Business was already rejected.',
  pending: 'Business has already been sent an email',
};

/**
 * Business Messages.
 */
const businessMessages = {
  allFieldsEmpty: 'All fields are empty. Atleast 1 field is needed.',
  businessDoesntExist: 'Business Doesn\'t Exist',
  branchDoesntExist: 'Branch Doesn\'t Exist',
  mismatchID: 'You can only edit your Info!',
  alreadyVerified: 'You have already completed your sign up process',
  alreadyRejected: 'An Admin has rejected your sign up',
  alreadyUnverified: 'Awaiting for an Admin\'s approval',
  invalidIamge: 'Not a valid image',
  invalidID: 'The id is invalid',
};

/**
 * Client Strings.
 */

/**
 * Client Validation Errors Messages.
 */
const clientValidationErrors = {
  emptyEmail: 'Email is a required field.',
  invalidEmail: 'Invalid Email.',
  emptyPassword: 'Password is a required field.',
  invalidPassword: 'Password length must be between 8 and 15 and contains at least one number.',
  emptyConfirmation: 'Password Confirmation is a required field.',
  passwordMismatch: 'Password and Password Confirmation must match.',
  emptyFirstName: 'Firstname is a required field.',
  emptyLastName: 'Lastname is a required field.',
  emptyMobile: 'Mobile is a required field.',
  invalidMobile: 'Mobile must be in this format 01xxxxxxxxx',
  emptyGender: 'Gender is a required field.',
  invalidGender: 'Invalid Gender.',
  invalidBirthdate: 'Invalid birthdate',
  userExists: 'User already exists.',
};

/**
 * Client Success Messages.
 */
const clientSuccess = {
  signup: 'Signup Successful, Please check your email for the email confirmation.',
  emailConfirmation: 'Please check your email for the email confirmation.',
  editInformation: 'Your information has been updated successfully.',
  editInformationWithEmail: 'Your information has been updated successfully. An email has been sent to your new email for the email confirmation.',
  logout: 'You have been logged out.',
};

/**
 * Service Success Messages.
 */
const serviceSuccess = {
  imageAdd: 'Image added successfully!',
  imageEdit: 'Description updated succesfully!',
  imageDelete: 'Image deleted succesfully!',
  serviceAdded: 'Service has been added successfully to your business',
  serviceEdited: 'Service has been edited successfully to your business',
  serviceDeleted: 'Service has been deleted successfully',
  offeringAdded: 'Offering has been added successfully to your business',
  offeringEdited: 'Offering has been edited successfully to your business',
  offeringDeleted: 'Offering has been deleted successfully',
};

/**
 * Service Failure Messages.
 */
const serviceFailure = {
  serviceNotFound: 'The specified service was not found.',
  imageNotFound: 'Image not found!',
  notYourService: 'Can not modify a service that is not owned by your business!',
  missingField: 'Missing Field(s)!',
  invalidService: 'This service is invalid.',
};

/**
 * Service Validation Errors Messages.
 */
const serviceValidationErrors = {
  invalidServiceID: 'Invalid Service ID',
  invalidImageID: 'Invalid Image ID',
  invalidStripeToken: 'Invalid Stripe Token',
};

/**
 * Client Forgot Password Messages.
 */
const clientForgotPassword = {
  CHECK_YOU_EMAIL: 'You should recieve an email to reset your password, if the email exists.',
  INVALID_RESET_TOKEN: 'Invalid reset token.',
  PASSWORD_RESET_SUCCESS: 'Password Changed Successfully.',
};

/**
 * Client Login Success Messages.
 */
const clientLoginMessages = {
  invalidCreds: 'Invalid Credentials.',
  loginSuccess: 'Client Login Success.',
  confirmEmail: 'Please confirm your email.',
  bannedClient: 'This user has been banned.',
  invalidToken: 'Invalid Token',
  notLoggedIN: 'You need to be logged in.',
};

/**
 * Client Confirmation Messages.
 */
const clientConfirmation = {
  emailAlreadyConfirmed: 'User email already confirmed.',
  notFound: 'User not found.',
};

/**
 * Client Verification Messages.
 */
const clientVerfication = {
  invalidToken: 'This token is invalid or has expired.',
  verificationSuccess: 'Your e-mail has been successfully confirmed.',
  alreadyConfirmed: 'Your e-mail is already confirmed.',
  accountBanned: 'Your account is banned.',
};

/**
 * Review Strings.
 */

/**
 * Review Error Messages.
 */
const reviewErrors = {
  invalidService: 'The service you are trying to review does not exist.',
  emptyRating: 'You must provide a rating in your review.',
  outOfRangeRating: 'The rating must be between 1 & 5.',
  descriptionTooLong: 'The review can have a maximum of 512 characters.',
  alreadyReviewedService: 'You have already reviewed this service.',
  invalidReview: 'This review does not exist.',
  userMismatchEdit: 'You did not create the review that you are trying to edit.',
  userMismatchDelete: 'You did not create the review that you are trying to delete.',
};

/**
 * Review Success Messages.
 */
const reviewSuccess = {
  createSuccess: 'Review added successfully.',
  updateSuccess: 'Review updated successfully.',
  deleteSuccess: 'Review deleted successfully.',
};

/**
 * Visitor Strings
 */

/**
 * Visitor Error Messages.
 */
const visitorErrors = {
  NoRelatedBusinesses: 'No related businesses',
  NoRelatedServices: 'No related services',
};

/**
 * Business Information Changed Messages.
 */
const businessInformationChanged = {
  UPDATE_SUCCESSFULL: 'Your information has been updated successfully.',
};

/**
 * Visitor Validation Errors Messages.
 */
const visitorValidationErrors = {
  InvalidID: 'Invalid category ID',
  InvalidOffset: 'Invalid Offset',
};

/**
 * Business Forgot Password Messages.
 */
const businessForgotPassword = {
  CHECK_YOU_EMAIL: 'You should recieve an email to reset your password, if the email exists.',
  INVALID_RESET_TOKEN: 'Invalid reset token.',
  PASSWORD_RESET_SUCCESS: 'Password Changed Successfully.',
};

/**
 * Service Strings
 */

/**
 * Service Validation Error Messages.
 */
const serviceValidationCRUDErrors = {
  emptyName: 'Service Name is a required field',
  emptyShortDescription: 'Service short description is a required field',
  invalidCategory: 'No such a category',
};

/**
 * Offering Validation Error Messages.
 */
const offeringValidationError = {
  emptyPrice: 'Offering Price is a required field',
  emptyStartDate: 'Offering Start Date is a required field',
  invalidStartDate: 'Invalid Start Date',
  emptyEndDate: 'Offering End Date is a required field',
  invalidEndDate: 'Invalid End Date',
  emptyLocation: 'Location is a required field',
  invalidBranchID: 'Branch is invalid',
  invalidServiceID: 'Service is invalid',
  invalidService: 'No such a service',
  invalidOperation: 'Not authorized for doing such an operation',
  invalidBranch: 'Your business doesnot have this branch',
  invalidOfferingID: 'Offering is invalid',
  invalidOffering: 'No such offering',
};


/**
 * Admin Strings
 */

/**
 * Admin Login Messages.
 */
const adminLoginMessages = {
  invalidCreds: 'Invalid Credentials.',
  loginSuccess: 'Admin Login Success.',
  invalidToken: 'Invalid Token',
};

/**
 * Admin Validation Error Messages.
 */
const adminValidationErrors = {
  emptyEmail: 'Email is a required field.',
  invalidEmail: 'Invalid Email.',
  emptyPassword: 'Password is a required field.',
  invalidPassword: 'Password length must be between 8 and 15 and contains at least one number.',
  passwordRequired: 'Password is a required field.',
  passwordLength: 'Password length must be between 8 and 15 and contains at least one number.',
  passwordMismatch: 'Password and Password Confirmation must match.',
  adminExists: 'Administrator already exists.',
  invalidBusinessID: 'Invalid Business ID',
  categoryTypeRequired: 'Category Type is required.',
  categoryTitleRequired: 'Category Title is required.',
  invalidClientID: 'Invalid Client ID',
};

/**
 * Admin Success Messages.
 */
const adminSuccess = {
  categoryAdded: 'Category added succesfully!',
  categoryEdited: 'Category edited succesfully!',
  categoryDeleted: 'Category deleted succesfully!',
  clientDeleted: 'Client removed succesfully',
  businessDeleted: 'Business removed succesfully',
};

/**
 * Admin Failure Messages.
 */
const adminFailures = {
  clientAlreadyDeleted: 'Client is already deleted',
  categoryAlreadyDeleted: 'Category is already deleted',
  businessAlreadyDeleted: 'Business is Already Deleted',
};

/**
 * Search Strings
 */

/**
 * Search Error Messages.
 */
const searchErrors = {
  emptySearchResult: 'No search results match the query.',
};

/**
 * Client Failure Messages.
 */
const clientFaliure = {
  notFound: 'The required client was not found.',
};

module.exports = {
  generalErrors,
  clientValidationErrors,
  clientSuccess,
  clientLoginMessages,
  clientConfirmation,
  clientForgotPassword,
  clientFaliure,

  clientVerfication,
  bussinessValidationErrors,
  serviceFailure,
  businessSuccess,

  businessLoginMessages,
  serviceSuccess,
  serviceValidationErrors,
  businessConfirmation,
  businessInformationChanged,
  businessForgotPassword,

  adminLoginMessages,
  adminValidationErrors,
  visitorErrors,
  visitorValidationErrors,
  businessMessages,

  serviceValidationCRUDErrors,
  offeringValidationError,
  reviewErrors,
  reviewSuccess,
  adminSuccess,
  searchErrors,
  adminFailures,
};
