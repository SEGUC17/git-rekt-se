<template>
    <div style="business-signup">
    
        <section class="business-signup-top hero is-bold">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title extra-large white">
                        Business signup
                    </h1>
                </div>
            </div>
        </section>
    
        <div class="container">
            <div class="business-signup-form columns">
                <div class="column is-half is-offset-one-quarter">
                    <div class="login-form">
    
                        <div v-show="errors.length > 0">
                            <div class="error" v-for="error in errors">
                                <el-alert :title="error" type="error" show-icon>
                                </el-alert>
                            </div>
                        </div>
    
                        <div v-show="success">
                            <el-alert :title="signupSuccess" type="success" show-icon>
                            </el-alert>
                        </div>
    
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
                            <el-form-item label="mobile number" prop="mobile">
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
    import {
        unverfiedBusinessSignupValidation
    } from '../../services/validation';
    
    export default {
        data() {
    
            return {
                form: new Form({
                    name: '',
                    email: '',
                    shortDescription: '',
                    mobile: '',
                }),
                rules2: unverfiedBusinessSignupValidation,
                errors: [],
                success: false,
                signupSuccess: '',
            };
        },
        methods: {
            submitForm(formName) {
                this.errors = [];
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const loader = this.$loading({
                            fullscreen: true,
                        });
                        this.form.post(EndPoints.Business().unverfiedSignup).then((data) => {
                            loader.close();
                            this.success = true;
                            this.signupSuccess = data.message;
                            console.log(this.success + ' ' + this.signupSuccess);
                        }).catch((e) => {
                               loader.close();
                            this.errors = e;
                        });;
                    } else {
                        loader.close();
                        this.errors.push('Please fill in all the fields.');
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
    html,
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
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
        background-color: rgba(0, 0, 0, 0.6);
        padding: 5px;
    }
    
    .error {
        margin-top: 20px;
    }
    
    .error:first-child {
        margin-top: 0;
    }
    
    .business-signup-top {
        background: #67B26F;
        /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #4ca2cd, #67B26F);
        /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #4ca2cd, #67B26F);
        /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        margin-bottom: 2em;
    }
    
    @media screen and (max-width: 999px) {
        .business-signup-form {
            margin: 2em;
        }
    }
</style>