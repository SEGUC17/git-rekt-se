<template>
    <div class="client-signup">
        <!-- Client Signup Header -->
        <section class="client-signin-top hero is-bold">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title extra-large white">
                        Client Sign Up
                    </h1>
                    <p class="subtitle white">
                        Enhance your skills and choose from our handpicked partners.
                    </p>
                </div>
            </div>
        </section>
    
        <div class="columns">
            <div class="column is-half is-offset-one-quarter">
    
                <div v-show="success">
                    <el-alert title="Success" type="success" :description="message" show-icon></el-alert>
                    <div class="has-text-centered">
                        <el-button type="text" :loading="loading" @click="resendMail">Resend Mail!</el-button>
                    </div>
                </div>
    
                <div v-show="!form.errors.isEmpty() || error">
                    <div class="error" v-for="key in form.keys" v-show="form.errors.has(key)">
                        <el-alert @close="form.errors.remove(key)" :title="key.toUpperCase()" type="error" :description="form.errors.getAll(key, ' | ')" show-icon></el-alert>
                    </div>
    
                    <div class="error" v-show="form.errors.has('serverError')">
                        <el-alert @close="form.errors.remove('serverError')" title="Server Errors" :description="form.errors.getAll('serverError', ' | ')" type="error" show-icon></el-alert>
                    </div>
    
                    <div class="error" v-show="error">
                        <el-alert @close="error = false" :title="message" type="error" show-icon></el-alert>
                    </div>
                </div>
    
    
                <el-form ref="form" :model="form" :rules="rules" :label-position="'top'">
                    <el-form-item label="First Name" prop="firstName">
                        <el-input v-model="form.firstName" placeholder="John"></el-input>
                    </el-form-item>
    
                    <el-form-item label="Last Name" prop="lastName">
                        <el-input v-model="form.lastName" placeholder="Appleseed"></el-input>
                    </el-form-item>
    
                    <el-form-item label="Email" prop="email">
                        <el-input v-model="form.email" placeholder="example@domain.com"></el-input>
                    </el-form-item>
    
                    <el-form-item label="Password" prop="password">
                        <el-input v-model="form.password" :type="showPassword">
                            <div slot="append">
                                <el-button @mousedown.native="showPassword = 'text'" @mouseup.native="showPassword = 'password'"><i class="fa fa-eye"></i>
                                </el-button>
                            </div>
                        </el-input>
                    </el-form-item>
    
                    <el-form-item label="Confirm Password" prop="confirmPassword">
                        <el-input v-model="form.confirmPassword" :type="showConfirm">
                            <div slot="append">
                                <el-button @mousedown.native="showConfirm = 'text'" @mouseup.native="showConfirm = 'password'"><i class="fa fa-eye"></i>
                                </el-button>
                            </div>
                        </el-input>
                    </el-form-item>
    
                    <el-form-item label="Mobile" prop="mobile">
                        <el-input v-model="form.mobile" placeholder="01123456789"></el-input>
                    </el-form-item>
    
                    <el-form-item label="Gender" prop="gender">
                        <el-radio-group v-model="form.gender">
                            <el-radio label="Male"></el-radio>
                            <el-radio label="Female"></el-radio>
                        </el-radio-group>
                    </el-form-item>
    
                    <el-form-item label="Birthdate">
                        <el-date-picker v-model="form.birthdate" type="date" :format="'dd-MM-yyyy'" placeholder="1-1-1990"></el-date-picker>
                    </el-form-item>
    
                    <el-form-item class="has-text-centered">
                        <el-button type="primary" icon="circle-check" @click="onClick" :loading="loading">
                            Sign Up
    
    
    
                        </el-button>
                        <el-button icon="circle-cross" @click="onReset">Reset</el-button>
                    </el-form-item>
                </el-form>
    
            </div>
        </div>
    </div>
</template>

<script>
    import Form from '../../services/Form';
    import Errors from '../../services/Errors';
    import {
        Client
    } from '../../services/EndPoints';
    import {
        clientSignUpValidation
    } from '../../services/validation';
    
    export default {
        data() {
            clientSignUpValidation.confirmPassword[1].validator = clientSignUpValidation.confirmPassword[1]
                .validator.bind(this);
            clientSignUpValidation.password[2].validator = clientSignUpValidation.password[2]
                .validator.bind(this);
            return {
                form: new Form({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: '',
                    gender: '',
                    mobile: '',
                    birthdate: '',
                }),
                rules: clientSignUpValidation,
                showPassword: 'password',
                showConfirm: 'password',
                success: false,
                error: false,
                message: '',
                clientEmail: '',
                loading: false,
            };
        },
        methods: {
            onClick() {
                this.error = false;
                this.success = false;
                this.message = '';
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.clientEmail = this.form.email;
                        this.loading = true;
                        this.form.post(Client().signup)
                            .then((data) => {
                                this.loading = false;
                                this.success = true;
                                this.message = data.message;
                            }).catch(() => {
                                this.loading = false;
                            });
                    }
                });
            },
            onReset() {
                this.$refs.form.resetFields();
            },
            resendMail() {
                this.loading = true;
                this.success = false;
                this.message = '';
                this.form.email = this.clientEmail;
                this.form.post(Client().resend)
                    .then((data) => {
                        this.loading = false;
                        this.success = true;
                        this.message = data.message;
                    }).catch(() => {
                        this.loading = false;
                    });
            },
        },
    };
</script>

<style>
    .error+.error {
        margin-top: 10px;
    }
</style>
