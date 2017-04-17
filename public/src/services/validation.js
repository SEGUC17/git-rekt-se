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