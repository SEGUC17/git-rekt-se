<template>
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
            axios.get(Business()
                .businessInfo, {
                    headers: {
                        Authorization: businessAuth.getJWTtoken(),
                    },
                }).then((infoResponse) => {
                    this.branchesForm.branches = infoResponse.data.results.branches;
                    this.branchesForm.branches.push({
                        location: '',
                        address: '',
                    });
            }).catch(e => this.errors = e);
    
        },
    
        methods: {
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
    
</style>