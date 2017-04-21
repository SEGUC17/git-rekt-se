<template>
    <div class="columns is-mobile">
        <div class="column is-half is-offset-one-quarter">
            <div>
                <div class="alert">
                    <div class="message" v-show="alert_show">
                        <el-alert :title="message" type="success" show-icon></el-alert>
                    </div>
                    <div class="error" v-show="error_show">
                        <el-alert  :title="errors" type="error" show-icon></el-alert>
                    </div>
                    <div class="error" v-show="form.errors.has('serverError')">
                        <el-alert @close="" :title="form.errors.getAll('serverError')" type="error" show-icon></el-alert>
                    </div>
                </div>
    
                <h1 class="title has-text-centered">Reset Password</h1>
                <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="demo-ruleForm">
                    <el-form-item label="Password" prop="password">
                        <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
                    </el-form-item>
    
                    <el-form-item label="Confirm Password" prop="confirmPassword">
                        <el-input type="password" v-model="form.confirmPassword" auto-complete="off"></el-input>
                    </el-form-item>
    
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('form')">Submit</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import Form from '../../services/Form';
    import EndPoints from '../../services/EndPoints';
    import {
        BusinessResetFormValidation
    } from '../../services/BusinessResetFormValidation.js';
    import Errors from '../../services/Errors';
    
    export default {
        data() {
            BusinessResetFormValidation.confirmPassword[1].validator = BusinessResetFormValidation.confirmPassword[1]
                .validator.bind(this);
            BusinessResetFormValidation.password[2].validator = BusinessResetFormValidation.password[2]
                .validator.bind(this);
            return {
                form: new Form({
                    password: '',
                    confirmPassword: '',
                    token: this.$route.params.token,
                }),
                errors: '',
                rules: BusinessResetFormValidation,
                message: '',
                alert_show: false,
                error_show: false,
                btn_disable: true,
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.form.post(EndPoints.Business().reset)
                            .then((data) => {
                                this.message = data.message;
                                this.alert_show = true;
                                this.error_show = false;
                            })
                            .catch((err) => {
                                this.alert_show = false;
                                this.error_show = false;
                            });
                    } else {
                        this.errors='Please insert correct inputs';
                        this.error_show = true;
                        this.alert_show = false;
                    }
                });
            },
        }
    }
</script>

<style>
    .error+.error {
        margin-bottom: 10px;
    }
    
    .message+.error {
        margin-bottom: 10px;
    }
</style>