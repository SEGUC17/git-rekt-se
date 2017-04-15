<template>
    <div class="hero-body">
        <div class="container">
            <div class="columns">
                <div class="column is-8 is-offset-2">
                    <div class="login-form">
                        <el-form :model="form" :rules="rules2" ref="form">
                            <el-form-item label="Business name" prop="name">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                            <el-form-item label="Email" prop="email">
                                <el-input v-model="form.email"></el-input>
                            </el-form-item>
                            <el-form-item label="Short description" prop="shortDescription">
                                <el-input v-model="form.shortDescription"></el-input>
                            </el-form-item>
                            <el-form-item label="mobile number" prop="phoneNumber">
                                <el-input v-model="form.mobile"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('form')">Submit</el-button>
                                <el-button @click="resetForm('form')">Reset</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
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
            var checkPhoneNumber = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('Please input the phone number'));
                } else if (value === '') {
                    callback(new Error('Please input the phone number'));
                } else if (!(/^01[0-2]{1}[0-9]{8}/.test(value))) {
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
                    mobile: '',
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
                        validator: checkEmail,
                        type: 'email',
                        message: 'Please input correct email address',
                        trigger: 'blur'
                    }],
                    mobile: [{
                        validator: checkPhoneNumber,
                        trigger: 'blur',
                        matches: {
                            options: [/^01[0-2]{1}[0-9]{8}/], // Egyptian Mobile phone
                        }
                    }],
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                         this.form.post(EndPoints.Business().unverfiedSignup).then(() => {
                            //TODO: add message
                        }).catch(err => console.log(err));
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