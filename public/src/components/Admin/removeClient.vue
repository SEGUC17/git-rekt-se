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
                 <span>Are you sure you want to delete {{currname}}?</span>
                 <span slot="footer" class="dialog-footer">
                 <el-button @click="sure = false">Cancel</el-button>
             <el-button class="button is-primary" @click="sure = false,confirmeddeletion(), shownot = true">Confirm</el-button>
                </span>
            </el-dialog>
    
       <el-table
        :data="clients"
        border
        style="width: 100%"
        empty-text="No Clients">
            <el-table-column
            prop="firstName"
            label="First Name"
            sortable = true>
            </el-table-column>
             <el-table-column
            prop="lastName"
            label="Last Name"
            sortable = true>
            </el-table-column>
            <el-table-column
            label ="Operation">
                <template scope = "scope">
                    <el-button class="button is-danger"@click="deleteclicked(scope.row)" >Delete &nbsp; 
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
    import { Notification } from 'element-ui';
    import { Admin } from '../../services/EndPoints.js';
    export default {
        data() {
            return {
                errors: [],
                clients:[],
                sure:false,
                shownot:false,
                currname:'',
                currid: '',
            }
        },
        mounted() {
                this.names = this.getClients();
        },
        methods: {
            getClients() {
        axios
            .get(Admin().listClients)
            .then((res) => {    
              this.clients = res.data;
              this.errors = [];
            })
            .catch((err) => {
                for(var i=0 ; i<err.response.data.errors.length; i += 1){
                     this.errors.push(err.response.data.errors[i]);
                }
              this.clients = [];
            });
      },

      deleteclicked(client) {
          this.currname = client.firstName+" "+client.lastName;
          this.currid = client._id;
          this.sure =true;
      }, confirmeddeletion() {
          
        axios
            .get(Admin().deleteClient(this.currid))
            .then((res) => {
                this.$notify({
                         title: 'Success',
                        message: 'Client Deleted Successfully!',
                        type: 'success'
                  });  
                    axios
                       .get(Admin().listClients)
                          .then((res) => {
                             this.clients = res.data;
                             this.errors = [];
                         })
                        .catch((err) => {
                              for(var i=0 ; i<err.response.data.errors.length; i += 1){
                                    this.errors.push(err.response.data.errors[i]);
                                 }
                             this.clients = [];
                             this.errors = [];
                        });
            })
            .catch((err) => {
                     for(var i=0 ; i<err.response.data.errors.length; i += 1){
                         this.errors.push(err.response.data.errors[i]);
                     }
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
