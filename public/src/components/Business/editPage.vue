<template>
    <div class="columns is-mobile">
        <div class="column is-half is-offset-one-quarter">
    
            <h1 class="title has-text-centered">Edit Info</h1>
    
            <div v-show="errors.length > 0">
                <div class="error" v-for="error in errors">
                    <el-alert :title="error" type="error" show-icon>
                    </el-alert>
                </div>
            </div>
    
            <div v-show="success">
                <el-alert :title="editSuccess" type="success" show-icon>
                </el-alert>
            </div>
    
    
            <el-tabs type="card" @tab-click="handleClick">
    
                <el-tab-pane name="basicInfotab" label="Basic Info" v-show="enableInfoTab">
                    <h3 class="title has-text-centered">Edit Your Basic Info</h3>
                    <div>
                        <el-form :model="infoForm" :rules="form1Rules" ref="infoForm" label-width="120px" label-position="top" class="demo-ruleForm">
    
                            <el-form-item label="Description" prop="description">
                                <el-input type="textarea" :autosize="{ minRows: 2}" v-model="infoForm.description"></el-input>
                            </el-form-item>
    
                            <el-form-item label="Working hours" prop="workingHours">
                                <el-input type="textarea" :autosize="{ minRows: 1}" v-model="infoForm.workingHours"></el-input>
                            </el-form-item>
    
                            <el-form-item label="Categories" prop="categories">
                                <el-select v-model="infoForm.categories" multiple :multiple-limit="3" placeholder="Select">
                                    <el-option v-for="category in categories" :key="category._id" :label="category.title" :value="category._id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
    
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('infoForm')">Create</el-button>
                                <el-button @click="resetForm('infoForm')">Reset</el-button>
                            </el-form-item>
    
                        </el-form>
    
                    </div>
                </el-tab-pane>
    
                <el-tab-pane name="branchestab" label="Branches" v-show="enableBranchesTab">
                    <h3 class="title has-text-centered">Edit Your Branches</h3>
                    <div>
    
                        <el-form :model="branchesForm" :rules="form2Rules" ref="branchesForm" label-width="120px" label-position="top" class="demo-ruleForm">
    
                            <el-form-item v-for="(branch, index) in branchesForm.branches" :key="index" :label="'Branch '+(index+1)" prop="branches">
                                <el-input placeholder="Please Enter Address here" v-model="branch.address">
                                    <el-select v-model="branch.location" placeholder="Location" slot="prepend">
                                        <el-option v-for="(location,index) in locations" :key="index" :label="location" :value="location">
                                        </el-option>
                                    </el-select>
                                </el-input>
                                <el-button @click="removeBranch(index)">Delete Branch</el-button>
                                <el-button @click="updateBranch(index)">Update Branch</el-button>
    
                                <el-button v-show="index === branchesForm.branches.length-1" @click="saveBranch(index)">Save New Branch</el-button>
                            </el-form-item>
    
    
                        </el-form>
    
                    </div>
                </el-tab-pane>
    
            </el-tabs>
    
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Form from '../../services/Form';
    import {
        infoFormRules,
        branchesFromRules
    } from '../../services/validation';
    import locations from '../../../../app/seed/service/locations';
    import {
        Visitor,
        Business
    } from '../../services/EndPoints';
    import businessAuth from '../../services/auth/businessAuth';
    
    export default {
        data() {
            return {
                infoForm: new Form({
                    description: '',
                    workingHours: '',
                    categories: [],
                }),
                branchesForm: new Form({
                    branches: []
                }),
                enableInfoTab: true,
                enableBranchesTab: false,
                form1Rules: infoFormRules,
                form2Rules: branchesFromRules,
                categories: [],
                errors: [],
                success: false,
                editSuccess: '',
                locations: locations,
            }
        },
        mounted() {
            axios.get(Business()
                .businessInfo, {
                    headers: {
                        Authorization: businessAuth.getJWTtoken(),
                    },
                }).then((infoResponse) => {
                axios.get(Visitor().businessCategories).then((categoriesResponse) => {
                    this.categories = categoriesResponse.data.results;
    
                    this.infoForm.description = infoResponse.data.results.description;
                    this.infoForm.workingHours = infoResponse.data.results.workingHours;
                    this.infoForm.categories = infoResponse.data.results.categories;
                    this.branchesForm.branches = infoResponse.data.results.branches;
    
                    this.branchesForm.branches.push({
                        location: '',
                        address: '',
                    });
                }).catch(e => this.errors = e);
            }).catch(e => this.errors = e);
    
        },
    
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (formName === 'infoForm') {
                            axios.put(Business().editInfo, this.infoForm.data(), {
                                headers: {
                                    Authorization: businessAuth.getJWTtoken(),
                                },
                            }).then((response) => {
                                this.success = true;
                                this.editSuccess = response.data.message;
                                setTimeout(() => {
                                    this.$router.go(this.$router.path);
                                }, 1000);
                            }).catch(e => this.errors = e);
                        } else {
    
                        }
                    } else {
                        errors = ['Please fill in the fields'];
                    }
    
    
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            handleClick(tab, event) {
                if (tab.name === 'basicInfotab') {
                    this.enableInfoTab = true;
                    this.enableBranchesTab = false;
                } else {
                    this.enableBranchesTab = true;
                    this.enableInfoTab = false;
                }
            },
            saveBranch(idx) {
                if (this.branchesForm.branches[idx].location && this.branchesForm.branches[idx].address) {
                    axios.post(Business().addBranch, {
                        branches: [this.branchesForm.branches[idx]]
                    }, {
                        headers: {
                            Authorization: businessAuth.getJWTtoken(),
                        },
                    }).then((response) => {
                        this.success = true;
                        this.editSuccess = response.data.message;
                        setTimeout(() => {
                            this.$router.go(this.$router.path);
                        }, 1000);
                    }).catch(e => this.errors = e);
                    this.branchesForm.branches.push({
                        location: '',
                        address: ''
                    });
                } else {
                    this.errors = ['Fill all the info of branch to save it'];
                }
    
            },
            removeBranch(idx) {
                axios.delete(Business().deleteBranch(businessAuth.user.userID(), this.branchesForm.branches[idx]._id), {
                    headers: {
                        Authorization: businessAuth.getJWTtoken(),
                    },
                }).then((response) => {
                    this.success = true;
                    this.editSuccess = response.data.message;
                    setTimeout(() => {
                        this.$router.go(this.$router.path);
                    }, 1000);
                }).catch(e => this.errors = e);
            },
            updateBranch(idx) {
                
                axios.put(Business().editBranch(businessAuth.user.userID(), this.branchesForm.branches[idx]._id), {
                    branch: this.branchesForm.branches[idx]
                }, {
                    headers: {
                        Authorization: businessAuth.getJWTtoken(),
                    },
                }).then((response) => {
                    this.success = true;
                    this.editSuccess = response.data.message;
                    setTimeout(() => {
                        this.$router.go(this.$router.path);
                    }, 1000);
                }).catch(e => this.errors = e);
            },
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