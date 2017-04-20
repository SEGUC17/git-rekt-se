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
            }
        },
        mounted() {
            businessAuth.refreshAuth();
            if (!businessAuth.user.authenticated) {                    
                this.$router.push('/');
                this.$toast.open({
                    message: 'Please login to edit your page',
                    position: 'bottom',
                    type: 'is-danger',
                });
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