export default {

};

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

export const infoFormRules = {
  description: [{
    required: true,
    message: 'Please enter a description for your business activity',
    trigger: 'blur',
  }],
  workingHours: [{
    required: true,
    messsage: 'Please enter your business working hours',
    trigger: 'blur',
  }],
  categories: [{
    validator(rule, value, callBack) {
      if (value.length === 0) {
        callBack([new Error('Please choose at least one category for your business')]);
      } else {
        callBack();
      }
    },
    trigger: 'blur',
  }],
};

export const branchesFromRules = {
  branches: [{
    validator(rule, value, callBack) {
      if (value.length === 0) {
        callBack([new Error('Please add at least one branch for your business')]);
      } else {
        callBack();
      }
    },
    trigger: 'blur',
  }],
};
