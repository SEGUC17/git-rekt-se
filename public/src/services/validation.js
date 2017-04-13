export default {

};

export const clientSignUpValidation = {
  email: [{
    required: true,
    message: 'Please Enter a valid email.',
    trigger: 'blur',
  }, {
    type: 'email',
    message: 'Must be an email.',
    trigger: 'blur',
  }],
  password: [],
  firstName: [],
  lastName: [],
  mobile: [],
  gender: [],
};
