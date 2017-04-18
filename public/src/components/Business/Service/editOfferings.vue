<template>
  <div class="main">
    <div class="container">
      <el-card class="create-offering">
        <el-alert v-for="error in generalErrors" type="error" :title="error" show-icon></el-alert>
        <div slot="header" class="clearfix">
          <span>Create Offering</span>
        </div>
        <el-alert v-if="createSuccess" type="success" :title="createSuccess" show-icon></el-alert>
        <el-alert v-if="editSuccess" type="success" :title="editSuccess" show-icon></el-alert>
        <el-alert v-if="deleteSuccess" type="success" :title="deleteSuccess" show-icon></el-alert>
        <el-alert v-for="error in createErrors" type="error" :title="error" show-icon></el-alert>
        <el-form :model="newOffering" ref="createOffering" :rules="offeringRules" label-position="left">
          <el-form-item label="Branch" required prop="branch">
            <el-select v-model="newOffering.branch" placeholder="Select a branch">
              <el-option v-for="item in branches" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Price" required prop="price">
            <el-input type="textarea" v-model.number="newOffering.price" placeholder="Set a price"></el-input>
          </el-form-item>
          <el-form-item label="Start Date -  End Date" required prop="dates">
            <el-date-picker v-model="newOffering.dates" type="daterange" placeholder="Set a duration">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="Capacity" required prop="capacity">
            <el-input type="textarea" v-model.number="newOffering.capacity" placeholder="Set a capacity"></el-input>
          </el-form-item>
          </el-form-item>
          <el-form-item class="is-pulled-right">
            <el-button type="primary" @click="createOffering">Create</el-button>
            <el-button @click="resetCreate">Clear</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <div class="offerings-list">
        <el-card class="offering-card" v-for="offering in offerings" :key="offering._id">
          <!--Layout Stuff-->
          <span>{{offering.address}}</span>
          <div class="offering-buttons is-pulled-right">
            <el-button icon="edit" @click="showEdit(offering)">
              Edit offering
            </el-button>
            <el-button icon="delete" @click="showDelete(offering)" type="danger">
              Delete offering
            </el-button>
          </div>
        </el-card>
      </div>
    </div>
    <el-dialog title="Edit offering" v-model="editVisible" size="large">
      <el-form ref="editOffering" :model="editFormOffering" :rules="offeringRules" label-position="left">
        <el-alert v-for="error in editErrors" type="error" :title="error" show-icon></el-alert>
         <el-form-item label="Branch" required prop="branch">
            <el-select v-model="editFormOffering.branch" placeholder="Select a branch">
              <el-option v-for="item in branches" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Price" required prop="price">
            <el-input type="textarea" v-model.number="editFormOffering.price" placeholder="Set a price"></el-input>
          </el-form-item>
          <el-form-item label="Start Date -  End Date" required prop="dates">
            <el-date-picker v-model="editFormOffering.dates" type="daterange" placeholder="Set a duration">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="Capacity" required prop="capacity">
            <el-input type="textarea" v-model.number="editFormOffering.capacity" placeholder="Set a capacity"></el-input>
          </el-form-item>
        <!--TODO Upload Cover Image-->
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="editVisible = false">Cancel</el-button>
      <el-button type="primary" @click="editOffering">Edit</el-button>
    </span>
    </el-dialog>
    <el-dialog title="Delete Offering" v-model="deleteVisible" size="small">
      <span>This cannot be undone. Delete this offering?</span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="deleteVisible = false">Cancel</el-button>
      <el-button type="danger" @click="deleteOffering">Delete</el-button>
    </span>
    </el-dialog>
  </div>
</template>


<script>
  import Axios from 'axios';
  import { Business } from '../../../services/EndPoints';
  import { offeringRules } from '../../../services/validation';
  import BusinessAuth from '../../../services/auth/businessAuth';
  
  export default {
    data() {
      return {
        serviceID: this.$route.params.id,
        offerings: [],
        branches: [],
        newOffering: {},
        generalErrors: [],
        offeringRules,
        createSuccess: '',
        createErrors: [],
        editFormOffering: {},
        editVisible: false,
        editSuccess: '',
        editErrors: [],
        offeringToDelete: {},
        deleteVisible: false,
        deleteSuccess: '',
        deleteErrors: [],
      };
    },
    mounted() {
      this.getOfferings();
      Axios.get(Business().listBranches, {
        headers: {
          Authorization: BusinessAuth.getJWTtoken(),
        },
      })
        .then((response) => {
          this.branches = response.data.branches;
        })
        .catch((err) => {
          this.generalErrors = err.response.data.errors;
        });
    },
    methods: {
      getOfferings() {
        const loader = this.$loading({
          fullscreen: true,
        });
        Axios.get(Business().listOfferings(this.serviceID), {
          headers: {
            Authorization: BusinessAuth.getJWTtoken(),
          },
        })
          .then((response) => {
            loader.close();
            this.offerings = response.data.offerings;
          })
          .catch((error) => {
            loader.close();
            this.generalErrors = error.response.data.errors.map((err) => {
              if (typeof err === 'string') {
                return err;
              }
              return err.msg;
            });
          });
      },
      createOffering() {
        this.createSuccess = '';
        this.createErrors = [];
        this.$refs.createOffering.validate((valid) => {
          if (valid) {
            const loader = this.$loading({
              fullscreen: true,
            });
            Axios.post(Business().createOffering(this.serviceID), this.newOffering, {
              headers: {
                Authorization: BusinessAuth.getJWTtoken(),
              },
            })
              .then((response) => {
                loader.close();
                this.createSuccess = response.data.message;
                this.resetCreate();
                this.getOfferings();
              })
              .catch((error) => {
                loader.close();
                this.createErrors = error.response.data.errors.map((err) => {
                  if (typeof err === 'string') {
                    return err;
                  }
                  return err.msg;
                });
              });
          }
        });
      },
      editOffering() {
        this.editSuccess = '';
        this.editErrors = [];
        this.$refs.editOffering.validate((valid) => {
          if (valid) {
            const loader = this.$loading({
              fullscreen: true,
            });
            Axios.post(Business().editOffering(this.serviceID, this.offeringToEdit._id),
             this.offeringToEdit, {
               headers: {
                 Authorization: BusinessAuth.getJWTtoken(),
               },
             })
              .then((response) => {
                this.editSuccess = response.data.message;
                this.editVisible = false;
                loader.close();
                this.getOfferings();
              })
              .catch((error) => {
                loader.close();
                this.editErrors = error.response.data.errors.map((err) => {
                  if (typeof err === 'string') {
                    return err;
                  }
                  return err.msg;
                });
              });
          }
        });
      },
      deleteOffering() {
        this.deleteSuccess = '';
        this.deleteErrors = [];
        const loader = this.$loading({
          fullscreen: true,
        });
        Axios.post(Business().deleteOffering(this.serviceID, this.offeringToDelete._id), null, {
          headers: {
            Authorization: BusinessAuth.getJWTtoken(),
          },
        })
          .then((response) => {
            this.deleteSuccess = response.data.message;
            this.deleteVisible = false;
            loader.close();
            this.getOfferings();
          })
          .catch((error) => {
            loader.close();
            this.deleteErrors = error.response.data.errors.map((err) => {
              if (typeof err === 'string') {
                return err;
              }
              return err.msg;
            });
          });
      },
      resetCreate() {
        this.$refs.createOffering.resetFields();
      },
      showEdit(offering) {
        this.editFormOffering = this.populateFormOffering(offering);
        this.editVisible = true;
      },
      showDelete(offering) {
        this.offeringToDelete = offering;
        this.deleteVisible = true;
      },
      populateFormOffering(offering) {
        const offeringToReturn = {};
        offeringToReturn.branch = offering.branch;
        offeringToReturn.price = offering.price;
        offeringToReturn.capacity = offering.capacity;
        offeringToReturn.dates = [offering.startDate, offering.endDate];
      },
    },
    computed: {
      offeringToCreate() {
        return {
          branch: this.newOffering.branch,
          price: this.newOffering.price,
          capacity: this.newOffering.capacity,
          startDate: this.newOffering.dates[0],
          endDate: this.newOffering.dates[1],
        };
      },
      offeringToEdit() {
        return {
          branch: this.editFormOffering.branch,
          price: this.editFormOffering.price,
          capacity: this.editFormOffering.capacity,
          startDate: this.editFormOffering.dates[0],
          endDate: this.editFormOffering.dates[1],
        };
      },
    },
  };
</script>
