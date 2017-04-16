<template>
    <div style="padding : 200px">
        <article class="message is-primary" v-show="form.success" style="padding : 50px">
            <div class="message-header">
                <p>Signup successfull. Pending admin verification</p>
            </div>
        </article>
        <article class="message is-danger" v-show="form.fail" style="padding : 50px">
            <div class="message-header">
                <p>Company name .</p>
            </div>
        </article>
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
                    success: false,
                    fail: false,
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
                            this.success = true;
                        }).catch(err => {
                            this.fail = true;
                        });
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

<style>
          html,body {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  height: 100%;
  padding: 0;
  margin: 0;
}

.email-input,
.password-input {
  border-radius: 40px;
  font-size: 20px;
  padding-left: 15px;
  color: #95A5A6;
}

.icon.user,
.icon.password {
  margin: 5px 10px 0 0;
}

.avatar img {
  border-radius: 100px;
  padding: 5px;
  border: 1px solid #dbdbdb;
}

.forgot-password a {
  color: #95A5A6;
  font-weight: bold;
  padding-right: 20px;
}

.login {
  padding-top: 20px;
}

.login button {
  border-radius: 40px;
  font-weight: bold;
}

.hero-body .container {
  margin-top: -100px;
}

.hero.is-dark .section {
  background-color: transparent;
}

.login-wrapper {
  margin: -0.75rem;
  overflow-y: hidden;
}

.hero-banner .title {
  display: inline-block;
  background-color: rgba(0,0,0, 0.6);
  padding: 5px;
}
</style>