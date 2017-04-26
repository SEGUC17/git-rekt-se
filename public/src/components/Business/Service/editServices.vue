<!--suppress JSUnresolvedFunction -->
<template>
  <div class="services-list">

    <!-- General Errors -->
    <div class="errors">
      <el-alert v-for="error in generalErrors" :key="error"
                type="error" :title="error"
                class="error" show-icon
                @close="generalErrors.splice(error, 1)">
      </el-alert>
    </div>

    <!-- Get services-->
    <div class="box" v-for="service in services" :key="service._id">
      <div class="content">

        <div class="title is-4"><router-link :to="`/service/${service._id}`">{{ service.name }}</router-link></div>
        <p class="subtitle">{{ service.shortDescription }}</p>

        <!-- Service Options -->
        <nav class="level actions">
          <button class="button is-info level-item"
                  @click="showEdit(service)">
              <span class="icon is-small">
                  <i class="fa fa-edit"></i>
              </span>&nbsp;Edit

          </button>

          <button class="button is-danger level-item"
                  @click="showDelete(service)">
              <span class="icon is-small">
                  <i class="fa fa-trash-o"></i>
              </span>&nbsp;Delete
          </button>

          <button class="button is-default level-item"
                  @click="showCoupons(service)">
              <span class="icon is-small">
                  <i class="fa fa-percent"></i>
              </span>&nbsp;Coupons
          </button>

          <button class="button is-default level-item"
                  @click="showOfferings(service)">
              <span class="icon is-small">
                  <i class="fa fa-money"></i>
              </span>&nbsp;Offerings
          </button>

          <button class="button is-default level-item"
                  @click="showGallery(service)">
              <span class="icon is-small">
                  <i class="fa fa-picture-o"></i>
              </span>&nbsp;Gallery
          </button>
        </nav>
      </div>
    </div>

    <!-- No Services to edit -->
    <div class="no-data hero" v-show="services.length === 0">
      <div class="hero-body has-text-centered">
        <el-icon name="circle-close" class="confirmation-icon icon-fail"></el-icon>
        <p class="title is-2">You have no services.</p>
        <a class="button is-info" @click.prevent="getServices">Refresh</a>
      </div>
    </div>
    <!-- Delete Service Modal -->
    <el-dialog title="Delete Service" v-model="deleteVisible" size="small">
      <span>This cannot be undone. Delete this service and its associated offerings, gallery, coupons and bookings?</span>
      <span slot="footer" class="dialog-footer">
                  <el-button @click="deleteVisible = false">Cancel</el-button>
                  <el-button type="danger" @click="deleteService">Delete</el-button>
          </span>
    </el-dialog>

    <!-- Edit Service Modal -->
    <el-dialog title="Edit Service" v-model="editVisible" size="large">
      <el-form ref="editService" :model="serviceToEdit" :rules="serviceRules"
               label-position="left">
        <div class="errors">
          <el-alert v-for="error in editErrors" :key="error" type="error" :title="error"
                    show-icon @close="editErrors.splice(error, 1)"></el-alert>
        </div>
        <el-form-item label="Name" required prop="name">
          <el-input v-model="serviceToEdit.name"
                    placeholder="The name of your service (Max 50 characters)"></el-input>
        </el-form-item>
        <el-form-item label="Short Description" required prop="shortDescription">
          <el-input type="textarea" v-model="serviceToEdit.shortDescription"
                    placeholder="A brief description of your service (Max 140 characters)"></el-input>
        </el-form-item>
        <el-form-item label="Description">
          <el-input type="textarea" v-model="serviceToEdit.description"
                    placeholder="A detailed description of your service"></el-input>
        </el-form-item>
        <el-form-item label="Categories">
          <el-select v-model="serviceToEdit.categories" multiple
                     placeholder="Categories your service falls under">
            <el-option v-for="item in categories" :key="item.value" :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Change Current Cover Image" prop="changeImage">
          <el-switch v-model="changeImage" on-text="" off-text=""
                     @change="autoClearEditImage"></el-switch>
        </el-form-item>
        <el-form-item v-if="changeImage" label="Cover Image" prop="coverImage">
          <input type="file" ref="editCoverImage" accept="image/*"
                 @change="editFilechanged"/>
          <el-form-item>
            <el-button v-if="serviceToEdit.coverImage" @click="resetEditImage">Remove</el-button>
            <span>Current cover image will be removed if this field is empty</span>
          </el-form-item>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">Cancel</el-button>
          <el-button type="primary" @click="editService">Edit</el-button>
      </span>

    </el-dialog>
  </div>
</template>


<script>
 /**
  * This component allows to Edit Services.
  */
  import axios from 'axios';
  import { Business } from '../../../services/EndPoints';
  import { serviceRules } from '../../../services/validation';
  import BusinessAuth from '../../../services/auth/businessAuth';
  import JWTCheck from '../../../services/JWTErrors';

  export default {
    /**
     * Data used by this component.
     * services: Array of services.
     * categories: Array of Categories.
     * generalErrors: Errors received from server.
     * serviceRules: Validation Rules to validate the data.
     * serviceToEdit: Chosen Service to Edit.
     * editVisible: true if Editing component is visible, false otherwise.
     * editSuccess: true if editing was successful, false otherwise.
     * editErrors: Array of Errors received from server when editing.
     * serviceToDelete: chosen service to delete.
     * deleteVisible: true if Delete component is visible, false otherwise.
     * deleteErrors: Errors received from server when deleting.
     */
    data() {
      return {
        services: [],
        categories: [],
        generalErrors: [],
        serviceRules,
        serviceToEdit: {
          _id: '',
          name: '',
          shortDescription: '',
          description: '',
          categories: '',
          coverImage: '',
        },
        changeImage: false,
        editVisible: false,
        editSuccess: '',
        editErrors: [],
        serviceToDelete: {
          _id: '',
        },
        deleteVisible: false,
        deleteSuccess: '',
        deleteErrors: [],
      };
    },
    /**
     * Ran when component is mounted on DOM.
     * Fetch the services and categories.
     */
    mounted() {
      this.getServices();
      this.getCategories();
    },

    methods: {
      /**
       * Get the possible categories.
       */
      getCategories() {
        axios.get(Business().listCategories, {
          headers: {
            Authorization: BusinessAuth.getJWTtoken(),
          },
        })
            .then((response) => {
              this.categories = response.data.categories;
            })
            .catch((error) => {
              if (error.response && JWTCheck(error.response.data.errors)) {
                BusinessAuth.removeData();
                this.$router.push('/');
                this.$toast.open({
                  text: 'Your sessions has expired. Please login.',
                  position: 'bottom',
                  type: 'danger',
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
       * Get the business services.
       */
      getServices() {
        const loader = this.$loading({
          fullscreen: true,
        });
        axios.get(Business().listServices, {
          headers: {
            Authorization: BusinessAuth.getJWTtoken(),
          },
        })
            .then((response) => {
              loader.close();
              this.services = response.data.services;
            })
            .catch((error) => {
              loader.close();
              if (error.response && JWTCheck(error.response.data.errors)) {
                BusinessAuth.removeData();
                this.$router.push('/');
                this.$toast.open({
                  text: 'Your sessions has expired. Please login.',
                  position: 'bottom',
                  type: 'danger',
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
       * Edit the current service.
       */
      editService() {
        this.editSuccess = '';
        this.editErrors = [];
        this.$refs.editService.validate((valid) => {
          if (valid) {
            const loader = this.$loading({
              fullscreen: true,
            });
            const editForm = new FormData();
            editForm.append('name', this.serviceToEdit.name);
            editForm.append('shortDescription', this.serviceToEdit.shortDescription);
            editForm.append('description', this.serviceToEdit.description);
            this.serviceToEdit.categories.forEach((category) => {
              editForm.append('categories[]', category);
            }, this);
            editForm.append('changeImage', this.changeImage);
            if (this.changeImage) {
              editForm.append('coverImage', this.serviceToEdit.coverImage);
            }
            axios.post(Business().editService(this.serviceToEdit._id), editForm, {
              headers: {
                Authorization: BusinessAuth.getJWTtoken(),
              },
            })
                .then((response) => {
                  this.editSuccess = response.data.message;
                  this.editVisible = false;
                  loader.close();
                  this.getServices();
                  this.resetEditImage();
                })
                .catch((error) => {
                  loader.close();
                  if (error.response && JWTCheck(error.response.data.errors)) {
                    BusinessAuth.removeData();
                    this.$router.push('/');
                    this.$toast.open({
                      text: 'Your sessions has expired. Please login.',
                      position: 'bottom',
                      type: 'danger',
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
       * Delete the current service.
       */
      deleteService() {
        this.deleteSuccess = '';
        this.deleteErrors = [];
        const loader = this.$loading({
          fullscreen: true,
        });
        axios.post(Business().deleteService(this.serviceToDelete._id), null, {
          headers: {
            Authorization: BusinessAuth.getJWTtoken(),
          },
        })
            .then((response) => {
              this.deleteSuccess = response.data.message;
              this.deleteVisible = false;
              loader.close();
              this.getServices();
            })
            .catch((error) => {
              loader.close();
              if (error.response && JWTCheck(error.response.data.errors)) {
                BusinessAuth.removeData();
                this.$router.push('/');
                this.$toast.open({
                  text: 'Your sessions has expired. Please login.',
                  position: 'bottom',
                  type: 'danger',
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
       * Reset Image field.
       */
      resetEditImage() {
        this.serviceToEdit.coverImage = '';
        if (this.$refs.editCoverImage) {
          this.$refs.editCoverImage.value = null;
        }
      },
      /**
       * Show Service editing Modal.
       */
      showEdit(service) {
        this.changeImage = false;
        this.serviceToEdit = service;
        this.editVisible = true;
      },

      /*
      * Get coupon page.
      */

      showCoupons(service) {
        this.$router.push(this.couponsURL(service));
      },
      /**
       * Get offerings page.
       */
      showOfferings(service) {
        this.$router.push(this.offeringsURL(service));
      },
      /**
       * Get Gallery page.
       */
      showGallery(service) {
        this.$router.push(this.galleryURL(service));
      },
      /**
       * Show Service deletion confirmation.
       */
      showDelete(service) {
        this.serviceToDelete = service;
        this.deleteVisible = true;
      },
      /**
       * Return the url to the edit business offering page.
       */
      offeringsURL(service) {
        return `/business/manage/services/${service._id}/offerings`;
      },
      /**
       * Return the url to the edit business gallery page.
       */
      galleryURL(service) {
        return `/business/manage/services/${service._id}/gallery`;
      },
      /**
       * Return the url to the edit business coupons page.
       */
      couponsURL(service) {
        return `/business/manage/services/${service._id}/coupons`;
      },
      /**
       * Edit a file on Change.
       */
      editFilechanged(e) {
        const files = e.target.files || e.dataTransfer.files;
        if (files.length > 0) {
          this.serviceToEdit.coverImage = files[0];
        }
        this.$nextTick();
      },
      /**
       * Clear the image.
       */
      autoClearEditImage() {
        if (!this.changeImage) {
          this.resetEditImage();
        }
      },
    },
  };
</script>

<style scoped>
  .actions button {
    margin: 0.2em;
  }
</style>
