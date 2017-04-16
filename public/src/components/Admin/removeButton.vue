<template>
        <div v-show="sure">
             <el-dialog title="Confirmation" v-show="sure" size="tiny" show-close=false>
                <div>Are you sure you want to delete {{currname}}</div>
                 <span slot="footer" class="dialog-footer" show-close=false>
                    <el-button class="button is-warning"@click="sure = false">Cancel</el-button>
                    <el-button class="button is-danger" @click="sure = false">Confirm</el-button>
                 </span>
            </el-dialog>
              
    
    <el-button class="button is-danger" style="float: right;"@click="deleteclicked(client.label)" >Delete &nbsp; <span class="icon">
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
                currname:'',
            }
        },
        mounted() {
                this.names = this.getClients();
        },
        methods: {

      deleteclicked(reviewid) {
          console.log(reviewid);
          this.currname=reviewid;
          this.sure =true;
        // axios
        //     .get(Client().deleteclient/reviewid)
        //     .then((res) => {
        //         console.log(res);
        //       this.clients = res.data;
        //     })
        //     .catch(() => {
        //       this.clients = [];
        //     });
      }, confirmeddeletion(reviewid) {
          console.log(reviewid);
          
        // axios
        //     .get(Client().reportReview/reviewid)
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
