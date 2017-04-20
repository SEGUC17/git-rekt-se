export default {

};

export const forgotPasswordValidation = {
  email: [{
    required: true,
    message: 'Please Enter a valid email.',
    trigger: 'blur',
  }, {
    type: 'email',
    message: 'Must be an email.',
    trigger: 'blur',
  }],
};
