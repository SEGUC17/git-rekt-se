<template>
    <div>
            <el-dialog title="Confirm Deletion" v-model="sure" size="tiny">
                 <span>Are you sure you want to remove this business?</span>
                    <span slot="footer" class="dialog-footer">
                    <el-button @click="sure = false">Cancel</el-button>
                    <el-button class="button is-primary" @click="sure = false,confirmeddeletion(), shownot = true">Confirm</el-button>
                </span>
            </el-dialog>
    
            <el-button class="button is-danger" style="float: right;"@click="deleteclicked()" >Delete &nbsp; 
                <span class="icon">
                    <i class="fa fa-trash-o"></i>
                </span>
            </el-button>
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
                sure:false,
                shownot:false,
                currid: '',
            }
        },
        props: ['id'],
        mounted() {
        },
        methods: {

      deleteclicked() {
          this.currid = id;
          this.sure =true;
      }, 
      confirmeddeletion() {
          axios
            .post(Admin().deleteBusiness(this.currid))
            .then((res) => {
                this.$notify({
                         title: 'Success',
                        message: 'Business Deleted Successfully!',
                        type: 'success'
                  });
            })
            .catch((err) => {
                    this.errors = (err.response.data.errors);
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
