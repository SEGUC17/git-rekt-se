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
            <el-tabs type="card" v-model="activeName">
    
                <el-tab-pane name="basicInfotab" label="Basic Info">
                    <h3 class="title has-text-centered">Edit Your Basic Info</h3>
                    <div>
                        <infoform></infoform>
                    </div>
                </el-tab-pane>
    
                <el-tab-pane name="branchestab" label="Branches">
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
    import infoform from './infoEditForm.vue';
    
    export default {
        components: {
            infoform
        },
        data() {
            return {
                activeName: 'basicInfotab',
               
                branchesForm: new Form({
                    branches: []
                }),
                form2Rules: branchesFromRules,
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