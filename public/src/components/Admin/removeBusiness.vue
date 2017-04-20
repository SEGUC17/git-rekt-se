<template>
  <div class="columns is-mobile">
    <div class="column is-half is-offset-one-quarter">
  
      <h1 class="title has-text-centered">Business list</h1>
  
      <div v-show="errors.length > 0">
        <div class="error" v-for="error in errors">
          <el-alert :title="error" type="error" show-icon>
          </el-alert>
        </div>
      </div>
  
      <el-dialog title="Confirm Deletion" v-model="sure" size="tiny">
        <span>Are you sure you want to delete {{currName}} with Email {{currEmail}}?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="sure = false">Cancel</el-button>
          <el-button class="button is-primary" @click="sure = false,confirmDeletion(), shownot = true">Confirm</el-button>
        </span>
      </el-dialog>
  
      <el-table :data="businesses" border style="width: 100%" empty-text="No Businesses">
        <el-table-column prop="name" label="Business Name" sortable=t rue>
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
  import { Admin } from '../../services/EndPoints';
  import adminAuth from '../../services/auth/adminAuth';
  
  export default {
    data() {
      return {
        errors: [],
        businesses: [],
        sure: false,
        shownot: false,
        currID: '',
        currName: '',
        currEmail: '',
      };
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
        this.getBusinesses();
      }
    },
    methods: {
      getBusinesses() {
        axios
          .get(Admin().listBusiness, {
            headers: {
              Authorization: adminAuth.getJWTtoken(),
            },
          })
          .then((response) => {
            this.businesses = response.data.results;
            console.log(this.businesses);
            this.errors = [];
          })
          .catch((error) => {
            console.log(error);
            this.errors = error.response.data.errors.map((err) => {
              if (typeof err === 'string') {
                return err;
              }
              return err.msg;
            });
            this.businesses = [];
          });
      },
      deleteClicked(business) {
        console.log('why');
        this.currName = business.name;
        this.currID = business._id;
        this.currEmail = business.email;
        this.sure = true;
      },
      confirmDeletion() {
        console.log(1111);
        console.log(adminAuth.getJWTtoken());
  
        axios
          .post(Admin().deleteBusiness(this.currID), null, {
            headers: {
              Authorization: adminAuth.getJWTtoken(),
            },
          })
          .then((response) => {
            this.$notify({
              title: 'Success',
              message: response.data.message,
              type: 'success',
            });
            this.getBusinesses();
          })
          .catch((error) => {
            this.errors = error.response.data.errors.map((err) => {
              if (typeof err === 'string') {
                return err;
              }
              return err.msg;
            });
          });
      },
    },
  };
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
