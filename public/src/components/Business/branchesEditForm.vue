<template>
  <div class="edit-branches">

    <!-- Errors -->
    <div class="errors" v-if="errors.length > 0">
      <div class="error" v-for="(error, index) in errors">
        <el-alert class="error" :title="error.msg || error" type="error" show-icon @close="closeError(index)">
        </el-alert>
      </div>
    </div>

    <!-- Success -->
    <div class="errors" v-if="success">
      <el-alert class="error" @close="success = false" :title="editSuccess" type="success" show-icon>
      </el-alert>
    </div>

    <!-- Edit Branch Form -->
    <el-form :model="branchesForm" :rules="form2Rules" ref="branchesForm"
             label-position="top" class="branches-edit-form">

      <el-form-item v-for="(branch, index) in branchesForm.branches" :key="index"
                    prop="branches" class="box edit-branch-item">
        <el-form-item label="Location" class="add-margin-top"
                      :required="index === branchesForm.branches.length-1">
          <el-select v-model="branch.location" placeholder="Location">
            <el-option v-for="(location, index) in locations" :key="index"
                       :label="location.label"
                       :value="location.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Address" class="add-margin-top"
                      :required="index === branchesForm.branches.length-1">
          <el-input placeholder="1 Infinite Loop, CA" v-model="branch.address"></el-input>
        </el-form-item>

        <div class="btns add-margin-top">
          <el-button type="danger" v-show="index < branchesForm.branches.length-1" slot="append"
                     @click="removeBranch(index)">
            Delete Branch
          </el-button>
          <el-button type="info" v-show="index < branchesForm.branches.length-1"
                     @click="updateBranch(index)">
            Update Branch
          </el-button>

          <el-button type="primary" v-if="index === branchesForm.branches.length-1"
                     @click="saveBranch(index)">Save Branch
          </el-button>

        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios';
  import Form from '../../services/Form';
  import { branchesFormRules } from '../../services/validation';
  import { Business, Visitor } from '../../services/EndPoints';
  import locs from '../../components/pages/Index/mainLocations';
  import businessAuth from '../../services/auth/businessAuth';

  export default {
    data() {
      return {
        branchesForm: new Form({
          branches: [],
        }),
        form2Rules: branchesFormRules,
        errors: [],
        loader: '',
        success: false,
        editSuccess: '',
        locations: '',
      };
    },
    mounted() {
      this.loadFormData();
    },
    methods: {
      /*
       * Remove alert from errors array on close button click.
       *  */

      closeError(idx) {
        this.errors.splice(idx, 1);
      },

      /*
       * Get List of branch possible locations.
       * */

      getLocations(cb) {
        this.loader = this.$loading({
          fullscreen: true,
        });
        axios
            .get(Visitor().locations)
            .then((res) => {
              this.locations = res.data;
              cb();
            })
            .catch((e) => {
              this.loader.close();
              this.locations = locs;
              cb(e.response.data.errors);
            });
      },

      /*
       * Load the current branches of the business.
       * */

      loadFormData() {
        this.loader = this.$loading({
          fullscreen: true,
        });

        this.getLocations((locationError) => {
          if (locationError) {
            this.errors = [];
          }
          axios.get(Business()
              .businessbranches, {
                headers: {
                  Authorization: businessAuth.getJWTtoken(),
                },
              }).then((infoResponse) => {
                this.branchesForm.branches = infoResponse.data.results;
                this.errors = [];
                this.branchesForm.branches.push({
                  location: '',
                  address: '',
                });
                this.loader.close();
              }).catch((e) => {
                this.errors = e.response.data.errors;
                this.loader.close();
              });
        });
      },

      /*
       * Save a new branch.
       * */

      saveBranch(idx) {
        this.errors = [];
        if (this.branchesForm.branches[idx].location && this.branchesForm.branches[idx].address) {
          this.loader = this.$loading({
            fullscreen: true,
          });
          axios.post(Business().addBranch, {
            branches: [this.branchesForm.branches[idx]],
          }, {
            headers: {
              Authorization: businessAuth.getJWTtoken(),
            },
          }).then((response) => {
            this.success = true;
            this.editSuccess = response.data.message;
            this.branchesForm.branches[idx]._id = response.data.results[0];
            this.loader.close();
          }).catch((e) => {
            this.errors = e.response.data.errors;
            this.loader.close();
          });

          this.branchesForm.branches.push({
            location: '',
            address: '',
          });
        } else {
          this.errors = ['Please fill all the required fields.'];
        }
      },

      /*
       * Remove a new branch.
       * */

      removeBranch(idx) {
        if (this.branchesForm.branches.length === 2) {
          this.errors = ['You must have at least one branch, You cannot delete this one.'];
        } else {
          this.loader = this.$loading({
            fullscreen: true,
          });
          axios.delete(Business().deleteBranch(businessAuth.user.userID(),
              this.branchesForm.branches[idx]._id), {
                headers: {
                  Authorization: businessAuth.getJWTtoken(),
                },
              }).then((response) => {
                this.success = true;
                this.editSuccess = response.data.message;
                this.branchesForm.branches.splice(idx, 1);
                this.loader.close();
              }).catch((e) => {
                this.errors = e.response.data.errors;
                this.loader.close();
              });
        }
      },

      /*
       * Update the branch information.
       * */

      updateBranch(idx) {
        this.loader = this.$loading({
          fullscreen: true,
        });
        axios.put(Business().editBranch(businessAuth.user.userID(),
            this.branchesForm.branches[idx]._id), {
              branch: this.branchesForm.branches[idx],
            }, {
              headers: {
                Authorization: businessAuth.getJWTtoken(),
              },
            }).then((response) => {
              this.success = true;
              this.editSuccess = response.data.message;
              this.loader.close();
            }).catch((e) => {
              this.loader.close();
              this.errors = e.response.data.errors;
            });
      },
    },
  };
</script>

<style>
  .add-margin-top {
    margin-top: 0.4em;
  }
</style>
