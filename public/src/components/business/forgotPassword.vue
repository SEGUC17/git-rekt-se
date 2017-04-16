<template>
    <div class="columns is-mobile">
        <div class="column is-half is-offset-one-quarter">
            <div>
                <div class="alert">
                    <div class="message" v-show="alert_show">
                        <el-alert :title="message" type="info" show-icon></el-alert>
                    </div>
                    <div class="error" v-show="error_show">
                        <el-alert  :title="errors" type="error" show-icon></el-alert>
                    </div>
    
                    <div class="error" v-show="form.errors.has('serverError')">
                        <el-alert  :title="form.errors.getAll('serverError')" type="error" show-icon></el-alert>
                    </div>
                </div>
    
                <h1 class="title has-text-centered">Forgot Password</h1>
    
                <el-form :model="form" ref="form" :rules="rules" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="Email" prop="email">
                        <el-input type="text" v-model="form.email" auto-complete="off"></el-input>
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
        forgotPasswordValidation
    } from '../../services/forgotPasswordValidation';
    
    export default {
        data() {
            return {
                form: new Form({
                    email: '',
                }),
                errors: '',
                rules: forgotPasswordValidation,
                message: '',
                alert_show: false,
                error_show: false,
    
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.form.post(EndPoints.Business().forgot)
                            .then((data) => {
                                this.message = data.message;
                                this.alert_show = true;
                                this.error_show = false;
                            })
                            .catch((err) => {
                                this.alert_show = false;
                                this.error_show = true;
                            });
                    } else {
                        this.errors = 'Please insert correct inputs';
                        this.alert_show = false;
                        this.error_show = true;
                    }
                });
            },
            hasErrors() {
                const errors = this.$refs.form.$children.filter(el => el.validateMessage.length > 0);
                return errors.length > 0;
            },
        }
    }
</script>
