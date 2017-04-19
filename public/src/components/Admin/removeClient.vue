<template>
    <div class="columns is-mobile">
        <div class="column is-half is-offset-one-quarter">
    
            <h1 class="title has-text-centered">Client list</h1>
    
            <div v-show="errors.length > 0">
                <div class="error" v-for="error in errors">
                    <el-alert :title="error" type="error" show-icon>
                    </el-alert>
                </div>
            </div>
    
            <el-dialog title="Confirm Deletion" v-model="sure" size="tiny">
                <span>Are you sure you want to delete {{currname}} with the email {{email}} ?</span>
                <span slot="footer" class="dialog-footer">
                     <el-button @click="sure = false">Cancel</el-button>
                 <el-button class="button is-danger" @click="sure = false,deleteClient(), shownot = true">Confirm</el-button>
                    </span>
            </el-dialog>
    
            <el-table :data="clients" border style="width: 100%" empty-text="No Clients" :default-sort="defaultSort">
                <el-table-column prop="firstName" label="First Name" sortable>
                </el-table-column>
                <el-table-column prop="lastName" label="Last Name" sortable>
                </el-table-column>
                <el-table-column prop="email" label="Email" sortable>
                </el-table-column>
                <el-table-column label="Operation">
                    <template scope="scope">
                        <el-button class="button is-danger"@click="deleteClicked(scope.row)" >Delete &nbsp; 
                            <span class="icon">
                                <i class="fa fa-trash-o"></i>
                            </span></el-button>
</template>
            </el-table-column>
        </el-table>
    </div>
</div>
</template>

<script>
    import axios from 'axios';
    import {
        Notification
    } from 'element-ui';
    import {
        Admin
    } from '../../services/EndPoints.js';
    import adminAuth from '../../services/auth/adminAuth';
    export default {
        data() {
            return {
                errors: [],
                clients: [],
                sure: false,
                shownot: false,
                currname: '',
                email: '',
                currid: '',
                defaultSort: {
                    prop: 'firstName', order: 'ascending'
                },
            }
        },
        mounted() {
            if (!adminAuth.isAuthenticated()) {
                this.$router.push('/');
                this.$toast.open({
                    message: 'Not authorized to do such an operation.',
                    position: 'bottom',
                    type: 'is-danger',
                });
            } else {
                this.getClients();
            }
        },
        methods: {
            getClients() {
                axios
                    .get(Admin().listClients, {
                        headers: {
                            Authorization: adminAuth.getJWTtoken(),
                        },
                    })
                    .then((response) => {
                        this.clients = response.data.results;
                        this.errors = [];
                    })
                    .catch((err) => {
                        this.errors = err.resposne.data.errors.map((err) => {
                            if (typeof err === 'string') {
                                return err;
                            }
                            return err.msg;
                        });
                        this.clients = [];
                    });
            },
            deleteClicked(client) {
                this.currname = client.firstName + " " + client.lastName;
                this.email = client.email;
                this.currid = client._id;
                this.sure = true;
            },
            deleteClient() {
                axios
                    .get(Admin().deleteClient(this.currid), {
                        headers: {
                            Authorization: adminAuth.getJWTtoken(),
                        },
                    })
                    .then((response) => {
                        this.$notify({
                            title: 'Success',
                            message: response.data.message,
                            type: 'success'
                        });
                        this.getClients();
                    })
                    .catch((err) => {
                        this.errors = err.resposne.data.errors.map((err) => {
                            if (typeof err === 'string') {
                                return err;
                            }
                            return err.msg;
                        });
                        this.clients = [];
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
</style>
