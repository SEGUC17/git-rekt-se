<template>
        <div v-show="sure">
             <el-dialog title="Are you sure you want to remove this business?" v-show="sure" size="tiny" show-close=false>
                 <span slot="footer" class="dialog-footer" show-close=false>
                    <el-button class="button is-warning"@click="sure = false">Cancel</el-button>
                    <el-button class="button is-danger" @click="sure = false">Confirm</el-button>
                 </span>
            </el-dialog>
              
    
    <el-button class="button is-danger" style="float: right;"@click="deleteclicked(id)" >Delete &nbsp; <span class="icon">
                            <i class="fa fa-trash-o"></i>
                        </span></el-button>
           
    </div>
</template>

<script>
    
    import axios from 'axios';
    import { Client } from '../../services/EndPoints.js';
    import { Visitor } from '../../services/EndPoints.js';
    export default {
        data() {
            return {
                errors: [],
                sure:false,
                currid:'',
            }
        },
        props: ['id'];
        mounted() {
                this.names = this.getClients();
        },
        methods: {

      deleteclicked(id) {
          console.log(id);
          this.currname = name;
          this.currid =id;
          this.sure =true;
        // axios
        //     .get(Client().deleteclient/currid)
        //     .then((res) => {
        //         console.log(res);
        //       this.clients = res.data;
        //     })
        //     .catch(() => {
        //       this.clients = [];
        //     });
      }, confirmeddelete(id) {
          console.log(id);
          
        // axios
        //     .get(Client().deleteBusiness/currid)
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
