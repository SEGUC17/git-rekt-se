<template>
    <el-form :model="form" :rules="rules2" ref="form" label-width="120px" class="demo-ruleForm">
        <el-form-item label="Business name" prop="name">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
            <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="Short description" prop="shortDescription">
            <el-input v-model="form.shortDescription"></el-input>
        </el-form-item>
        <el-form-item label="mobile number" prop="phoneNumber">
            <el-input v-model.number="form.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('form')">Submit</el-button>
            <el-button @click="resetForm('form')">Reset</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import Form from '../../services/Form';
    import EndPoints from '../../services/EndPoints';
    export default {
        data() {
            var checkDescription = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('Please input the description'));
                } else if (value === '') {
                    callback(new Error('Please input the description'));
                } else {
                    callback();
                }
            };
            var checkName = (rule, value, callback) => { //TODO: add: check against database
                if (!value) {
                    callback(new Error('Please input the Name'));
                } else if (value === '') {
                    callback(new Error('Please input the Name'));
                } else {
                    callback();
                }
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please input a password'));
                } else {
                    if (!(/^(?=.*\d).{8,15}$/.test(value))) {
                        callback(new Error('Password must be between 8 and 15 characters and contains at least one number.'));
                    } else {
                        if (this.form.confirmPassword !== '') {
                            this.$refs.form.validateField('confirmPassword');
                        }
                        callback();
                    }
    
                }
            };
            var validaePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please input the password again'));
                } else if (value !== this.ruleForm2.pass) {
                    callback(new Error('Two inputs don\'t match!'));
                } else {
                    callback();
                }
            };
            var checkPhoneNumber = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('Please input the phone number'));
                } else if (value === '') {
                    callback(new Error('Please input the phone number'));
                } else if (/^01[0-2]{1}[0-9]{8}/.test(value)) {
                    callback(new Error('Please provide a valid phone number'));
                } else {
                    callback();
                }
            };
            var checkEmail = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('Please input the email'));
                } else if (value === '') {
                    callback(new Error('Please input the email'));
                } else {
                    callback();
                }
            };
            return {
                form: new Form({
                    name: '',
                    email: '',
                    shortDescription: '',
                    phoneNumber: '',
                }),
                rules2: {
                    name: [{
                        validator: checkName,
                        trigger: 'blur'
                    }],
                    shortDescription: [{
                        validator: checkDescription,
                        trigger: 'blur'
                    }],
                    email: [{
                        validator:checkEmail,
                        type: 'email',
                        message: 'Please input correct email address',
                        trigger: 'blur'
                    }],
                    phoneNumber: [{
                        validator: checkPhoneNumber,
                        trigger: 'blur'
                    }],
                }
            };
        },
        methods: {
            submitForm(formName) {
                console.log(formName);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.form.Reset();
            }
        }
    }
</script>