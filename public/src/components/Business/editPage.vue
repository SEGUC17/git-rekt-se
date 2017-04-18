<template>
    <div class="columns is-mobile">
        <div class="column is-half is-offset-one-quarter">
    
            <h1 class="title has-text-centered">Edit Info</h1>
    
            <el-tabs type="card" v-model="activeName">
    
                <el-tab-pane name="basicInfotab" label="Basic Info">
                    <div>
                        <infoform></infoform>
                    </div>
                </el-tab-pane>
    
                <el-tab-pane name="branchestab" label="Branches">
                    <div>
                    <branchesform></branchesform>
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
    import branchesform from './branchesEditForm.vue';
    
    export default {
        components: {
            infoform,
            branchesform
        },
        data() {
            return {
                activeName: 'basicInfotab',
                errors: [],
                success: false,
                editSuccess: '',
            }
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