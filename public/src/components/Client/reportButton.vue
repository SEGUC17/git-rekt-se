<template>
    <div>
        <div v-show="errors.length > 0">
            <div class="error" v-for="error in errors">
                <el-alert :title="error" type="error" show-icon>
                </el-alert>
            </div>
        </div>
        <el-dialog title="Confirm Deletion" v-model="sure" size="tiny">
            <span>Are you sure you want to report this review ?</span>
            <span slot="footer" class="dialog-footer">
                        <el-button @click="sure = false">Cancel</el-button>
                        <el-button class="button is-primary" @click="sure = false,confirmReport(), shownot = true">Confirm</el-button>
                    </span>
        </el-dialog>
    
        <el-button id="mybtn" class="button is-danger" @click="reviewClicked()">Report &nbsp;
        </el-button>
    </div>
</template>

<script>
    import axios from 'axios';
    import {
        Notification
    } from 'element-ui';
    import {
        Client
    } from '../../services/EndPoints.js';
    import clientAuth from '../../services/auth/clientAuth';

    export default {
        data() {
            return {
                errors: [],
                sure: false,
                shownot: false,
                currid: '',
            }
        },
        props: ['repid'],
        mounted() {
            if(!clientAuth.isAuthenticated) {
                this.$router.push('/');
                this.$toast.open({
                    message: 'Please login to report this review',
                    position: 'bottom',
                    type: 'is-danger',
                });
            }
        },
        methods: {
            reviewClicked() {
                this.currid = this.repid;
                this.sure = true;
            },
            confirmReport() {
                axios
                    .post(Client().reportReview(this.currid), null, {
                        headers: {
                            Authorization: clientAuth.getJWTtoken(),
                        }
                    })
                    .then((response) => {
                        this.$notify({
                            title: 'Success',
                            message: response.data.message,
                            type: 'success'
                        });
                        document.getElementById("mybtn").disabled = true;
                        this.errors = [];
                    })
                    .catch((error) => {
                        this.errors = error.response.data.errors.map((err) => {
                            if (typeof err === 'string') {
                                return err;
                            }
                            return err.msg;
                        });
                    });
            }
        }
    }
</script>

<style>
    .error {
        margin-top: 20px;
    }
    
    .error:first-child {
        margin-top: none;
    }
    
    .demo-ruleForm {
        margin-top: 30px;
    }
</style>
