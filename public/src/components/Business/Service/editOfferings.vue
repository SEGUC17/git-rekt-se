<template>
  <div class="edit-offerings">
    <div class="offering-tabs">
      <!-- General Errors -->
      <div class="errors">
        <el-alert v-for="error in generalErrors" :key="error" type="error" :title="error"
                  class="error" show-icon @close="generalErrors.splice(error, 1)">
        </el-alert>
      </div>

      <!-- Navigation tabs -->
      <div class="tabs is-centered">
        <ul>
          <li @click="active = 1" :class="{ 'is-active': (active === 1) }"><a>Create Offering</a>
          </li>
          <li @click="active = 2" :class="{ 'is-active': (active === 2) }"><a>Edit Offerings</a>
          </li>
        </ul>
      </div>

      <!-- Create Offering Tab -->
      <transition name="fade">
        <div class="box create-offering" v-show="active === 1">
          <!-- Offering Created-->
          <div class="errors">
            <el-alert v-if="createSuccess" type="success" class="error"
                      :title="createSuccess" show-icon>

            </el-alert>
            <el-alert v-for="error in createErrors" :key="error" class="error"  type="error"
                      :title="error" show-icon></el-alert>
          </div>
          <el-form :model="newOffering" ref="createOffering" :rules="offeringRules">
            <el-form-item label="Branch" required prop="branch">
              <el-select v-model="newOffering.branch" placeholder="Select a branch">
                <el-option v-for="item in branches" :key="item.value" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Price" required prop="price">
              <el-input v-model.number="newOffering.price" placeholder="Set a price"></el-input>
            </el-form-item>
            <el-form-item label="Start Date - End Date" required prop="dates">
              <el-date-picker v-model="newOffering.dates" type="daterange"
                              placeholder="Set a duration">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="Capacity" required prop="capacity">
              <el-input v-model.number="newOffering.capacity"
                        placeholder="Set a capacity"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="createOffering">Create</el-button>
              <el-button @click="resetCreate">Clear</el-button>
            </el-form-item>
          </el-form>
        </div>
      </transition>

      <!-- Offerings List Tab -->
      <transition name="fade">
        <div class="box offerings-list" v-show="active === 2">
          <el-alert v-if="editSuccess" class="error" type="success" :title="editSuccess" show-icon></el-alert>
          <el-alert v-if="deleteSuccess" class="error" type="success" :title="deleteSuccess" show-icon></el-alert>
          <div class="box" v-for="offering in offerings">

            <h4 class="subtitle is-4">
              <span><i class=" icon fa fa-map-marker"></i></span> {{ offering.location }}
              </h4>

            <h6 class="subtitle is-6">
              <span><i class=" icon fa fa-location-arrow"></i></span> {{ offering.address }}
              </h6>

            <h6 class="subtitle is-6">
              <span><i class=" icon fa fa-calendar"></i></span> From {{ offering.startDate | moment }}
              </h6>

            <h6 class="subtitle is-6">
              <span><i class=" icon fa fa-calendar"></i></span> To {{ offering.endDate | moment }}
              </h6>

            <h6 class="subtitle is-6">
              <span><i class=" icon fa fa-money"></i></span> {{ offering.price }} EGP
              </h6>

            <h6 class="subtitle is-6">
              <span><i class=" icon fa fa-users"></i></span> {{ offering.capacity }} clients
              </h6>

            <nav class="level actions">
              <button class="button is-info level-item" @click="showEdit(offering)">
                    <span class="icon is-small">
                        <i class="fa fa-edit"></i>
                    </span>&nbsp;Edit

              </button>

              <button class="button is-danger level-item" @click="showDelete(offering)">
                    <span class="icon is-small">
                        <i class="fa fa-trash-o"></i>
                    </span>&nbsp;Delete

              </button>
            </nav>
          </div>
        </div>
      </transition>

      <!-- No Offerings to edit -->
      <div class="no-data hero" v-show="offerings.length === 0">
        <div class="hero-body has-text-centered">
          <el-icon name="circle-close" class="confirmation-icon icon-fail"></el-icon>
          <p class="title is-2">This service has no offerings.</p>
          <a class="button is-info" @click.prevent="getOfferings">Refresh</a>
        </div>
      </div>

    </div>

    <!-- Edit Offering Modal -->
    <el-dialog title="Edit offering" v-model="editVisible" size="large">
      <el-form ref="editOffering" :model="editFormOffering" :rules="offeringRules"
               label-position="left">
        <el-alert v-for="error in editErrors" :key="error" type="error" :title="error"
                  show-icon></el-alert>
        <el-form-item label="Branch" required prop="branch">
          <el-select v-model="editFormOffering.branch" placeholder="Select a branch">
            <el-option v-for="item in branches" :key="item.value" :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Price" required prop="price">
          <el-input type="price" v-model.number="editFormOffering.price"
                    placeholder="Set a price"></el-input>
        </el-form-item>
        <el-form-item label="Start Date - End Date" required prop="dates">
          <el-date-picker v-model="editFormOffering.dates" type="daterange"
                          placeholder="Set a duration">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Capacity" required prop="capacity">
          <el-input type="capacity" v-model.number="editFormOffering.capacity"
                    placeholder="Set a capacity"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="editOffering">Edit</el-button>
                  </span>
    </el-dialog>

    <!-- Delete Offering Modal -->
    <el-dialog title="Delete Offering" v-model="deleteVisible" size="small">
      <span>This cannot be undone. Delete this offering and its associated bookings?</span>
      <span slot="footer" class="dialog-footer">
                    <el-button @click="deleteVisible = false">Cancel</el-button>
                    <el-button type="danger" @click="deleteOffering">Delete</el-button>
                  </span>
    </el-dialog>
  </div>
</template>


<script>
 /**
  * This component allows business to Edit Offerings.
  */
  import Axios from 'axios';
  import { Business } from '../../../services/EndPoints';
  import { offeringRules } from '../../../services/validation';
  import BusinessAuth from '../../../services/auth/businessAuth';
  import JWTCheck from '../../../services/JWTErrors';
  
  export default {
    /**
     * Data used by this component.
     */
    data() {
      return {
        active: 1,
        serviceID: this.$route.params.id,
        offerings: [],
        branches: [],
        newOffering: {
          branch: '',
          price: '',
          dates: '',
          capacity: '',
        },
        generalErrors: [],
        offeringRules,
        createSuccess: '',
        createErrors: [],
        editFormOffering: {
          _id: '',
          branch: '',
          price: '',
          dates: '',
          capacity: '',
        },
        editVisible: false,
        editSuccess: '',
        editErrors: [],
        offeringToDelete: {
          _id: '',
        },
        deleteVisible: false,
        deleteSuccess: '',
        deleteErrors: [],
      };
    },
    /**
     * Ran when component is mounted on DOM.
     * If user is not authenticated route him back,
     * otherwise List Offerings and Branches.
     */
    mounted() {
      BusinessAuth.refreshAuth();
      if (!BusinessAuth.user.authenticated) {
        this.$router.push('/');
        this.$toast.open({
          message: 'Not authorized for doing such an operation.',
          position: 'bottom',
          type: 'is-danger',
        });
      } else {
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
              if(err.response && JWTCheck(err.response.data.errors)) {
                    businessAuth.removeData();
                    this.$router.push('/');
                    this.$toast.open({
                      text: 'Your sessions has expired. Please login.',
                      position: 'bottom',
                      type: 'danger'
                    });
                  } else {
                   this.generalErrors = err.response.data.errors;
                  }
            });
      }
    },
    /**
     * All Methods used by this component.
     */
    methods: {
      /**
       * List all offerings.
       */
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
              if(error.response && JWTCheck(error.response.data.errors)) {
                    businessAuth.removeData();
                    this.$router.push('/');
                    this.$toast.open({
                      text: 'Your sessions has expired. Please login.',
                      position: 'bottom',
                      type: 'danger'
                    });
                  } else {
                   this.generalErrors = error.response.data.errors.map((err) => {
                      if (typeof err === 'string') {
                        return err;
                      }
                      return err.msg;
                    });
                  }
            });
      },
      /**
       * Create an offering.
       */
      createOffering() {
        this.createSuccess = '';
        this.createErrors = [];
        this.$refs.createOffering.validate((valid) => {
          if (valid) {
            const loader = this.$loading({
              fullscreen: true,
            });
            Axios.post(Business().createOffering(this.serviceID), this.offeringToCreate, {
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
                  if(error.response && JWTCheck(error.response.data.errors)) {
                    businessAuth.removeData();
                    this.$router.push('/');
                    this.$toast.open({
                      text: 'Your sessions has expired. Please login.',
                      position: 'bottom',
                      type: 'danger'
                    });
                  } else {
                    this.createErrors = error.response.data.errors.map((err) => {
                      if (typeof err === 'string') {
                        return err;
                      }
                      return err.msg;
                      });
                  }
                });
          }
        });
      },
      /**
       * Edit an offering.
       */
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
                  if(error.response && JWTCheck(error.response.data.errors)) {
                    businessAuth.removeData();
                    this.$router.push('/');
                    this.$toast.open({
                      text: 'Your sessions has expired. Please login.',
                      position: 'bottom',
                      type: 'danger'
                    });
                  } else {
                    this.editErrors = error.response.data.errors.map((err) => {
                      if (typeof err === 'string') {
                        return err;
                      }
                      return err.msg;
                    });
                  }
                });
          }
        });
      },
      /**
       * Delete an offering.
       */
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
              if(error.response && JWTCheck(error.response.data.errors)) {
                    businessAuth.removeData();
                    this.$router.push('/');
                    this.$toast.open({
                      text: 'Your sessions has expired. Please login.',
                      position: 'bottom',
                      type: 'danger'
                    });
                  } else {
                    this.deleteErrors = error.response.data.errors.map((err) => {
                      if (typeof err === 'string') {
                        return err;
                      }
                      return err.msg;
                    });
                  }
            });
      },
      /**
       * Reset form fields.
       */
      resetCreate() {
        this.$refs.createOffering.resetFields();
      },
      /**
       * Show Edit Offering.
       */
      showEdit(offering) {
        this.editFormOffering = this.populateFormOffering(offering);
        this.editVisible = true;
      },
      /**
       * Show Delete Offering.
       */
      showDelete(offering) {
        this.offeringToDelete = offering;
        this.deleteVisible = true;
      },
      /**
       * Fill Form with offering data.
       */
      populateFormOffering(offering) {
        const offeringToReturn = {};
        offeringToReturn._id = offering._id;
        offeringToReturn.branch = offering.branch;
        offeringToReturn.price = offering.price;
        offeringToReturn.capacity = offering.capacity;
        offeringToReturn.dates = [new Date(offering.startDate), new Date(offering.endDate)];
        return offeringToReturn;
      },
    },
    /**
     * Computed properties for this component.
     */
    computed: {
      /**
       * The object to create an offering with.
       */
      offeringToCreate() {
        return {
          branch: this.newOffering.branch,
          price: this.newOffering.price,
          capacity: this.newOffering.capacity,
          startDate: this.newOffering.dates[0],
          endDate: this.newOffering.dates[1],
        };
      },
      /**
       * The object to edit an offering with.
       */
      offeringToEdit() {
        return {
          _id: this.editFormOffering._id,
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

<style>
  .edit-offerings-top {
    background: #395e90;
    /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #3fa5a2, #395e90);
    /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #3fa5a2, #395e90);
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    margin-bottom: 2em;
  }
</style>
