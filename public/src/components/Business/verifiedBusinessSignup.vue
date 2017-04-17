<template>
    <div class="columns is-mobile">
        <div class="column is-half is-offset-one-quarter">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px" label-position="top" class="demo-ruleForm">
    
                <h1 class="title has-text-centered">Login</h1>
    
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
    
                <el-form-item label="Password" prop="password">
                    <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
    
                <el-form-item label="Confirm Password" prop="confirmPassword">
                    <el-input v-model="form.confirmPassword" type="password"></el-input>
                </el-form-item>
    
                <el-form-item label="Description" prop="description">
                    <el-input type="textarea" :autosize="{ minRows: 2}" v-model="form.description"></el-input>
                </el-form-item>
    
                <el-form-item label="Working hours" prop="workingHours">
                    <el-input type="textarea" :autosize="{ minRows: 1}" v-model="form.workingHours"></el-input>
                </el-form-item>
    
                <el-form-item label="Categories" prop="categories">
                    <el-select v-model="form.categories" multiple :multiple-limit="3" placeholder="Select">
                        <el-option v-for="category in categories" :key="category._id" :label="category.title" :value="category._id">
                        </el-option>
                    </el-select>
                </el-form-item>
    
                <el-form-item v-for="(branch, index) in form.branches" :key="index" :label="'Branch '+(index+1)" prop="branches">
                    <el-input placeholder="Please Enter Address here" v-model="branch.address">
                        <el-select v-model="branch.location" placeholder="Location" slot="prepend">
                            <el-option v-for="(location,index) in locations" :key="index" :label="location" :value="location">
                            </el-option>
                        </el-select>
                        <el-button @click="removeBranch(index)" slot="append">Delete Branch</el-button>
                    </el-input>
                    <el-button v-show="index === form.branches.length-1" @click="addBranch">New Branch</el-button>
                </el-form-item>
    
                <el-form-item>
                    <el-button type="primary" @click="submitForm('form')">Create</el-button>
                    <el-button @click="resetForm('form')">Reset</el-button>
                </el-form-item>
    
            </el-form>
        </div>
    </div>
</template>

<script>
    import Form from '../../services/Form';
    import {
        verifiedBusinessSignupRules
    } from '../../services/validation';
    import locations from '../../../../app/seed/service/locations';
    import {
        Visitor
    } from '../../services/EndPoints';
    import axios from 'axios';
    import businessAuth from '../../services/businessAuth';
    
    export default {
        data() {
            verifiedBusinessSignupRules.confirmPassword[1].validator = verifiedBusinessSignupRules.confirmPassword[1]
                .validator.bind(this);
            verifiedBusinessSignupRules.password[2].validator = verifiedBusinessSignupRules.password[2]
                .validator.bind(this);
            return {
                form: new Form({
                    password: '',
                    confirmPassword: '',
                    description: '',
                    workingHours: '',
                    categories: [],
                    branches: [{
                        location: '',
                        address: ''
                    }],
                }),
                categories: [],
                locations: locations,
                errors: [],
                success: false,
                signupSuccess: '',
                rules: verifiedBusinessSignupRules,
            };
        },
        mounted() {
            axios.get(Visitor().businessCategories).then((response) => {
                this.categories = response.data.results;    
            }).catch(e => {
                this.errors = e;
            });
        },
        methods: {
            submitForm(formName) {
                this.form.branches = this.form.branches.filter((branch) => {
                    return branch.location !== '' && branch.address !== '';
                });
                this.errors = [];
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        businessAuth.verifiedsignup(this.$route.params.token, this.form.data(), (responseErrs, response) => {
                            if (responseErrs) {
                                this.errors = responseErrs.errors.map((err) => {
                                    if (typeof err === 'string') {
                                        return err;
                                    } else {
                                        return err.msg;
                                    }
                                });
                            } else {
                                this.success = true;
                                this.signupSuccess = response.message;
                                setTimeout(() => {
                                    this.$router.push('/');
                                }, 1000);
                            }
                        });
                    } else {
                        this.addBranch();
                        this.errors.push('Please fill in all the fields');
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.form.branches = [];
                this.addBranch();
            },
            addBranch() {
                this.form.branches.push({
                    location: '',
                    address: ''
                });
            },
            removeBranch(idx) {
                this.form.branches = this.form.branches.filter((branch, index) => {
                    return idx !== index;
                });
                if (this.form.branches.length === 0) {
                    this.addBranch();
                }
            }
        }
    }
</script>

<style>
    .el-select {
        width: 180px;
    }
    
    .el-button {
        margin-top: 20px;
        margin-left: 10px;
    }

    .error {
        margin-bottom: 20px;
    }
    .demo-ruleForm {
        margin-top: 30px;
        margin-bottom: 40px;
    }
</style>