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
    
            <div v-show="logged_in">
                <el-alert :title="loginSuccess" type="success" show-icon>
                </el-alert>
            </div>
    
    
            <div v-for="client in clients"><li>{{client.label}}<el-button type="danger" style="float: right;" >Danger</el-button></li></div>
            </div>
        </div>
    </div>
</template>

<script>
    
    import axios from 'axios';
    import { Admin } from '../../services/EndPoints.js';
    import { Visitor } from '../../services/EndPoints.js';
    export default {
        data() {
            return {
                errors: [],
                clients:[],
            }
        },
        mounted() {
                this.names = this.getClients();
        },
        methods: {
            getClients() {
        axios
            .get(Visitor().locations)
            .then((res) => {
                console.log(res);
              this.clients = res.data;
            })
            .catch(() => {
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
    .demo-ruleForm {
        margin-top: 30px;
    }
</style>
