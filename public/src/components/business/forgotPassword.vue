<template>
    <div class="business-reset-password">
        <section class="business-forgot-top hero is-bold">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title extra-large white">
                        Forgot Password
                    </h1>
                </div>
            </div>
        </section>
    
        <div class="reset-password-form columns">
            <div class="column is-8 is-offset-2">
                <div class="error-alerts">
                    <el-alert :title="message" v-show="successShow" type="success" show-icon></el-alert>
                    <el-alert :title="error" v-show="errorShow" type="success" show-icon></el-alert>
                </div>
                <div class="login-form">
                    <el-form :model="form" ref="form" :rules="rules">
                        <el-form-item prop="email" label="Email">
                            <el-input v-model="form.email" type="email" icon="message">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('form')" :loading="loading">Forgot Password
                            </el-button>
                        </el-form-item>
    
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Form from '../../services/Form';
    import {
        Business
    } from '../../services/EndPoints';
    import {
        forgotPasswordValidation
    } from '../../services/validation';
    
    export default {
        data() {
            return {
                form: new Form({
                    email: '',
                }),
                errors: '',
                rules: forgotPasswordValidation,
                message: '',
                successShow: false,
                errorShow: false,
                loading: false,
            };
        },
        methods: {
            submitForm(formName) {
                this.error_show = false;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.form.post(Business().forgot)
                            .then((data) => {
                                this.loading = false;
                                this.message = data.message;
                                this.successShow = true;
                            })
                            .catch((err) => {
                                this.errorShow = true;
                                this.loading = false;
                                this.errors = err;
                            });
                    } else {
                        this.loading = false;
                        this.errors = 'Please insert correct inputs';
                        this.errorShow = true;
    
                    }
                });
            },
        }
    }
</script>

<style>
    .business-forgot-top {
        background: #159957;
        /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #155799, #159957);
        /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #155799, #159957);
        /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        margin-bottom: 2em;
    }
    
    @media screen and (max-width: 999px) {
        .reset-password-form {
            margin: 2em;
        }
    }
</style>
