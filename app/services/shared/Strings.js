/**
 * Constant Strings
 */

const bussinessValidationErrors = {
  passwordRequired: 'Password is a required field.',
  passwordLength: 'Password length must be between 8 and 15 and contains at least one number.',
  passwordMismatch: 'Password and Password Confirmation must match.',
  workingHoursRequired: 'Working Hours is a required field.',
  categoriesRequired: 'Must Include atleast 1 category.',
  branchesRequired: 'Must Include aleast 1 branch.',
};

const clientValidationErrors = {
  emptyEmail: 'Email is a required field.',
  invalidEmail: 'Invalid Email.',
  emptyPassword: 'Email is a required field.',
  invalidPassword: 'Password length must be between 8 and 15 and contains at least one number.',
  emptyConfirmation: 'Password Confirmation is a required field.',
  passwordMismatch: 'Password and Password Confirmation must match.',
  emptyFirstName: 'Firstname is a required fielD.',
  emptyLastName: 'Lastname is a required field.',
  emptyMobile: 'Mobile is a required field.',
  invalidMobile: 'Mobile must be in this format 01xxxxxxxxx',
  emptyGender: 'Gender is a required field.',
  invalidGender: 'Invalid Gender.',
  invalidBirthdate: 'Invalid birthdate',
  userExists: 'User already exists.',
};

const clientSuccess = {
  signup: 'Signup Successful, Please check your email for the email confirmation.',
  emailConfirmation: 'Please check your email for the email confirmation.',
};

const serviceSuccess = {
  imageAdd: 'Image added succesfully!',
  imageEdit: 'Description updated succesfully!',
  imageDelete: 'Image deleted succesfully!',
};

const serviceFail = {
  invalidService: 'Service not found!',
  invalidImage: 'Image not found!',
};

module.exports = {
  clientValidationErrors,
  clientSuccess,
  bussinessValidationErrors,
  serviceSuccess,
  serviceFail,
};
