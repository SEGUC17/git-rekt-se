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

             <div v-show="sure">
             <el-dialog title="Confirmation" v-show="sure" size="tiny" show-close=false>
                <div>Are you sure you want to delete {{currname}}</div>
                 <span slot="footer" class="dialog-footer" show-close=false>
                    <el-button class="button is-warning"@click="sure = false">Cancel</el-button>
                    <el-button class="button is-danger" @click="sure = false">Confirm</el-button>
                 </span>
            </el-dialog>
              
            </div>
    
            <div v-show="logged_in">
                <el-alert :title="loginSuccess" type="success" show-icon>
                </el-alert>
            </div>
    
    
            <div v-for="client in clients">
                <div>{{client.label}}
                            <el-button class="button is-danger" style="float: right;"@click="deleteclicked(client.label)" >Delete &nbsp; <span class="icon">
                            <i class="fa fa-trash-o"></i>
                        </span></el-button>
                        <br></br>
                    </div>
                </div>
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
                sure:false,
                currname:'',
                dialogVisible: false,
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
      },

      deleteclicked(clientid) {
          console.log(clientid);
          this.currname=clientid;
          this.sure =true;
        // axios
        //     .get(Admin().deleteclient/clientid)
        //     .then((res) => {
        //         console.log(res);
        //       this.clients = res.data;
        //     })
        //     .catch(() => {
        //       this.clients = [];
        //     });
      }, confirmeddeletion(clientid) {
          console.log(clientid);
          
        // axios
        //     .get(Admin().deleteclient/clientid)
        //     .then((res) => {
        //         console.log(res);
        //       this.clients = res.data;
        //     })
        //     .catch(() => {
        //       this.clients = [];
        //     });
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
