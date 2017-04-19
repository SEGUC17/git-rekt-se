<template>
    <div>
        <div v-show="errors.length > 0">
            <div class="error" v-for="(error, index) in errors">
                <el-alert :title="error" type="error" show-icon @close="closeError(index)">
                </el-alert>
            </div>
        </div>
    
        <div v-show="success">
            <el-alert :title="editSuccess" type="success" show-icon>
            </el-alert>
        </div>
    
        <el-form :model="branchesForm" :rules="form2Rules" ref="branchesForm" label-width="120px" label-position="top" class="demo-ruleForm">
    
            <el-form-item v-for="(branch, index) in branchesForm.branches" :key="index" :label="'Branch '+(index+1)" prop="branches">
                <el-input placeholder="Please Enter Address here" v-model="branch.address">
                    <el-select v-model="branch.location" placeholder="Location" slot="prepend">
                        <el-option v-for="(location,index) in locations" :key="index" :label="location" :value="location">
                        </el-option>
                    </el-select>
                </el-input>
                <el-button v-show="index < branchesForm.branches.length-1" @click="removeBranch(index)">Delete Branch</el-button>
                <el-button v-show="index < branchesForm.branches.length-1" @click="updateBranch(index)">Update Branch</el-button>
    
                <el-button v-show="index === branchesForm.branches.length-1" @click="saveBranch(index)">Save Branch</el-button>
            </el-form-item>
    
        </el-form>
    </div>
</template>

<script>
    import axios from 'axios';
    import Form from '../../services/Form';
    import {
        infoFormRules,
        branchesFormRules
    } from '../../services/validation';
    import locations from '../../../../app/seed/service/locations';
    import {
        Business
    } from '../../services/EndPoints';
    import businessAuth from '../../services/auth/businessAuth';
    
    export default {
        data() {
            return {
                branchesForm: new Form({
                    branches: []
                }),
                form2Rules: branchesFormRules,
                errors: [],
                success: false,
                editSuccess: '',
                locations: locations,
            }
        },
        mounted() {
            this.loadFormData();
        },
        methods: {
            closeError(idx) {
                this.errors.splice(idx, 1);
            },
            loadFormData() {
                const loader = this.$loading({
                    fullscreen: true,
                });
                axios.get(Business()
                    .businessbranches, {
                        headers: {
                            Authorization: businessAuth.getJWTtoken(),
                        },
                    }).then((infoResponse) => {
                    loader.close();
                    this.branchesForm.branches = infoResponse.data.results;
                    this.errors = [];
                    this.branchesForm.branches.push({
                        location: '',
                        address: '',
                    });
                }).catch(e => {
                    loader.close();
                    this.errors = e.response.data.errors;
                });
            },
            saveBranch(idx) {
                this.errors = [];
                if (this.branchesForm.branches[idx].location && this.branchesForm.branches[idx].address) {
                    const loader = this.$loading({
                        fullscreen: true,
                    });
                    axios.post(Business().addBranch, {
                        branches: [this.branchesForm.branches[idx]]
                    }, {
                        headers: {
                            Authorization: businessAuth.getJWTtoken(),
                        },
                    }).then((response) => {
                        this.success = true;
                        this.editSuccess = response.data.message;
                        console.log(response.data);
                        this.branchesForm.branches[idx]._id = response.data.results[0];
                        loader.close();
                        setTimeout(() => {
                            this.success = false;
                            this.editSuccess = '';
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
                if (this.branchesForm.branches.length === 2) {
                    this.errors = ['You must have atleast one branch you cannot delete this one'];
                } else {
                    const loader = this.$loading({
                    fullscreen: true,
                });
                axios.delete(Business().deleteBranch(businessAuth.user.userID(), this.branchesForm.branches[idx]._id), {
                    headers: {
                        Authorization: businessAuth.getJWTtoken(),
                    },
                }).then((response) => {
                    this.success = true;
                    this.editSuccess = response.data.message;
                    this.branchesForm.branches.splice(idx, 1);
                    console.log(this.branchesForm.branches);
                    loader.close();
                    setTimeout(() => {
                        this.success = false;
                        this.editSuccess = '';
                    }, 1000);
                }).catch(e => {
                    loader.close();
                    this.errors = e.response.data.errors;
                });
                }
            },
            updateBranch(idx) {
                const loader = this.$loading({
                    fullscreen: true,
                });
                axios.put(Business().editBranch(businessAuth.user.userID(), this.branchesForm.branches[idx]._id), {
                    branch: this.branchesForm.branches[idx]
                }, {
                    headers: {
                        Authorization: businessAuth.getJWTtoken(),
                    },
                }).then((response) => {
                    this.success = true;
                    this.editSuccess = response.data.message;
                    loader.close();
                    setTimeout(() => {
                        this.success = false;
                        this.editSuccess = '';
                    }, 1000);
                }).catch(e => {
                    loader.close();
                    this.errors = e.response.data.errors;
                });
            },
        }
    
    }
</script>

<style>
    
</style>