<template>
    <div>
            <el-dialog title="Confirm Deletion" v-model="sure" size="tiny">
                 <span>Are you sure you want to report this review?</span>
                    <span slot="footer" class="dialog-footer">
                    <el-button @click="sure = false">Cancel</el-button>
                    <el-button class="button is-primary" @click="sure = false,confirmedreport(), shownot = true">Confirm</el-button>
                </span>
            </el-dialog>
    
            <el-button id ="mybtn" class="button is-danger"@click="reviewclicked()" >Report &nbsp; 
            </el-button>
    </div>
</template>

<script>
    
    import axios from 'axios';
    import { Notification } from 'element-ui';
    import { Client } from '../../services/EndPoints.js';
    export default {
        data() {
            return {
                errors: [],
                sure:false,
                shownot:false,
                currid: '',
            }
        },
        props: ['repid'],
        mounted() {
        },
        methods: {

      reviewclicked() {
          this.currid = this.repid;
          this.sure =true;
      }, 
      confirmedreport() {
          axios
            .post(Client().reportReview(this.currid))
            .then((res) => {
                this.$notify({
                         title: 'Success',
                        message: 'Review reported successfully!',
                        type: 'success'
                  });
                  document.getElementById("mybtn").disabled = true;
                  this.errors = [];
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
