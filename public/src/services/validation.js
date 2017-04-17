export default {

};

export const loginRules = {
  email: [{
    required: true,
    message: 'Please enter your email',
    trigger: 'blur',
  }],
  password: [{
    required: true,
    message: 'Please enter your password',
    trigger: 'blur',
  }],
};
