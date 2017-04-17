export const loginRules = {
  email: [{
    required: true,
    message: 'Email is required.',
    trigger: 'blur',
  }],
  password: [{
    required: true,
    message: 'Password is required.',
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
