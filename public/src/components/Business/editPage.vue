<template>
    <div class="columns is-mobile">
        <div class="column is-half is-offset-one-quarter">
    
            <h1 class="title has-text-centered">Edit Info</h1>
    
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

                                <el-button v-show="index === branchesForm.branches.length-1" @click="addBranch">Add a New Branch</el-button>
                            </el-form-item>

    
                        </el-form>
    
                    </div>
                </el-tab-pane>
    
            </el-tabs>
    
        </div>
    </div>
</template>

<script>
    import Form from '../../services/Form';
    import {
        infoFormRules, branchesFromRules
    } from '../../services/validation';
    import locations from '../../../../app/seed/service/locations';
    export default {
        data() {
            
            return {
                infoForm: new Form({
                    description: '',
                    workingHours: '',
                    categories: '',
                }),
                branchesForm: new Form({
                    branches: [{
                        location: '',
                        address: '',
                    }]
                }),
                enableInfoTab: true,
                enableBranchesTab: false,
                form1Rules: infoFormRules,
                form2Rules: branchesFromRules,
                categories: [{
                    title: 'hello1',
                    _id: '1'
                }, {
                    title: 'hello2',
                    _id: '2'
                }, {
                    title: 'hello3',
                    _id: '3'
                }, {
                    title: 'hello4',
                    _id: '4'
                }, ],
                locations: locations,
            }
        },
    
        methods: {
            submitForm(formName) {
                console.log(formName);
                console.log(this.$refs[formName]);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log(this.infoForm.data());
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
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
            addBranch() {
                this.branchesForm.branches.push({
                    location: '',
                    address: ''
                });
            },
            removeBranch(idx) {
                this.branchesForm.branches = this.branchesForm.branches.filter((branch, index) => {
                    return idx !== index;
                });
                if (this.branchesForm.branches.length === 0) {
                    this.addBranch();
                }
            },
            updateBranch(idx) {

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