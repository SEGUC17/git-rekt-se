export const clientLoginRules = {
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

export const reviewRules = {
  rating: [{
    required: true,
    min: 0,
    max: 5,
    message: 'Please enter a rating',
    trigger: 'blur',
  }],
};

export default {
  reviewRules,
};
