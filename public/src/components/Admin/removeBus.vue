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
        :data="businesses"
        border
        style="width: 100%"
        empty-text="No Businesses">
            <el-table-column
            prop="name"
            label="Business Name"
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


<script>
    
    import axios from 'axios';
    import { Notification } from 'element-ui';
    import { Admin } from '../../services/EndPoints.js';
    export default {
        data() {
            return {
                errors: [],
                businesses: [],
                sure:false,
                shownot:false,
                currid: '',
            }
        },
        mounted() {
            this.businesses = this.getBusinesses();
        },
        methods: {
        getBusinesses() {
            axios
            .get(Admin().listBusiness)
            .then((res) => {    
              this.businesses = res.data;
            })
            .catch((err) => {
                for(var i=0 ; i<err.response.data.errors.length; i += 1){
                     this.errors.push(err.response.data.errors[i]);
                }
              this.businesses = [];
            });
      },
      deleteclicked(business) {
          this.currname = business.name;
          this.currid = business._id;
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
                  axios
                    .get(Admin().listBusiness)
                    .then((res) => {    
                    this.businesses = res.data;
                    this.errors = [];
                    })
                    .catch((err) => {
                        for(var i=0 ; i<err.response.data.errors.length; i += 1){
                            this.errors.push(err.response.data.errors[i]);
                        }
                    this.businesses = [];
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


