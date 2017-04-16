<template>
    <div class="columns is-mobile">
        <div class="column is-half is-offset-one-quarter">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px" label-position="top" class="demo-ruleForm">
    
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
    
                <el-form-item label="Categories" prop="categoriesChoosed">
                    <el-select v-model="form.categoriesChoosed" multiple multiple-limit:3 placeholder="Select">
                        <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id">
                        </el-option>
                    </el-select>
                </el-form-item>
    
                <el-form-item v-for="(branch, index) in form.branchesEntered" :key="index" :label="'Branch '+(index+1)" prop="branchesEntered">
                    <el-input placeholder="Please Enter Address here" v-model="branch.address">
                        <el-select v-model="branch.location" placeholder="Location" slot="prepend">
                            <el-option v-for="(location,index) in locations" :key="index" :label="location" :value="location">
                            </el-option>
                        </el-select>
                    <el-button @click="removeBranch(index)" slot="append">Delete Branch</el-button>
                    </el-input>
                    <el-button v-show="index === form.branchesEntered.length-1" @click="addBranch">New Branch</el-button>
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
    } from '../../services/validation'
    import locations from '../../../../app/seed/service/locations'
    export default {
        data() {
            return {
                form: new Form({
                    password: '',
                    confirmPassword: '',
                    description: '',
                    workingHours: '',
                    categoriesChoosed: [],
                    branchesEntered:[{
                        location:'',
                        address:''
                    }],
                }),
                categories: [{
                    name: 'Self Development',
                    id: 1
                }, {
                    name: 'Language Courses',
                    id: 2
                }, {
                    name: 'Self Development 2',
                    id: 3
                }, {
                    name: 'Language Courses 2',
                    id: 4
                }],
                locations: locations,
                rules: verifiedBusinessSignupRules,
            };
        },
        methods: {
            submitForm(formName) {
                this.form.branchesEntered = this.form.branchesEntered.filter((branch) => {
                    return branch.location !== '' && branch.address !== '';
                });
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.form);
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        this.addBranch();
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            addBranch() {
                this.form.branchesEntered.push({
                    location: '',
                    address: ''
                });
            },
            removeBranch(idx) {
                this.form.branchesEntered = this.form.branchesEntered.filter((branch, index) => {
                    return idx !== index;
                });
                if (this.form.branchesEntered.length === 0) {
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

</style>