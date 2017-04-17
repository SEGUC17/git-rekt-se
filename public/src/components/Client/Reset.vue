<template>
    <div>
        <el-alert title="Password changed successfully" v-show="form.success" type="success" show-icon>
        </el-alert>
    
         <el-alert title="Token expired" v-show="form.fail" type="error" show-icon>
        </el-alert>

        <div class="hero-body">
            <div class="contains">
                <div class="columns">
                    <div class="column is-8 is-offset-2">
                        <div class="login-form">
                            <el-form :model="form" :rules="rules" ref="form">
    
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
            </div>
        </div>
    </div>
</template>

<script>
    import Form from '../../services/Form';
    import EndPoints from '../../services/EndPoints.js';
    import {
        clientForgotPassword
    } from '../../services/validation';
    export default {
        data() {
            clientForgotPassword.confirmPassword[1].validator = clientForgotPassword.confirmPassword[1]
                .validator.bind(this);
            clientForgotPassword.password[2].validator = clientForgotPassword.password[2]
                .validator.bind(this);
            return {
                form: new Form({
                    token: this.$route.params.token,
                    password: '',
                    confirmPassword: '',
                    success: false,
                    fail: false,
                }),
                errors: {},
                rules: clientForgotPassword
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.form.post(EndPoints.Client().reset)
                            .then((data) => {
                                this.form.success = true;
                            })
                            .catch((err) => {
                                this.form.fail = true;
                            });
                    }
                });
            },
        }
    }
</script>