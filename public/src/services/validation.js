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

export const serviceRules = {
  name: [{
    required: true,
    message: 'Please enter a name for your service',
    trigger: 'blur',
  }],
  shortDescription: [{
    required: true,
    message: 'Please enter a short description (max 140 characters) of your service',
    max: 140,
    trigger: 'blur',
  }],
};

export default {
  serviceRules,
};
