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
