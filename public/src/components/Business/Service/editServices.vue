<template>
  <div class="services-list">
    <div class="box" v-for="service in services" :key="service._id">
      <div class="content">

        <div class="title is-4">{{ service.name }}</div>
        <p class="subtitle">{{ service.shortDescription }}</p>

        <!-- Service Options -->
        <nav class="level actions">
          <button class="button is-info level-item"
                  @click="showEdit(service)">
              <span class="icon is-small">
                  <i class="fa fa-edit"></i>
              </span>&nbsp;Edit
          </button>

          <button class="button is-danger level-item">
              <span class="icon is-small">
                  <i class="fa fa-trash-o"></i>
              </span>&nbsp;Delete

          </button>

          <button class="button is-default level-item">
              <span class="icon is-small">
                  <i class="fa fa-percent"></i>
              </span>&nbsp;Coupons

          </button>

          <button class="button is-default level-item">
              <span class="icon is-small">
                  <i class="fa fa-money"></i>
              </span>&nbsp;Offerings

          </button>

          <button class="button is-default level-item">
              <span class="icon is-small">
                  <i class="fa fa-picture-o"></i>
              </span>&nbsp;Gallery

          </button>

        </nav>
      </div>

      <!-- Edit Service Modal -->

      <!-- Delete Service Modal -->
      <el-dialog title="Delete Service" v-model="deleteVisible" size="small">
            <span>This cannot be undone. Delete this service and its associated offerings, gallery, coupons and bookings?</span>
            <span slot="footer" class="dialog-footer">
                  <el-button @click="deleteVisible = false">Cancel</el-button>
                  <el-button type="danger" @click="deleteService">Delete</el-button>
          </span>
      </el-dialog>


      <el-dialog title="Edit Service" v-model="editVisible" size="large">
        <el-form ref="editService" :model="serviceToEdit" :rules="serviceRules" label-position="left">
          <el-alert v-for="error in editErrors" :key="error" type="error" :title="error" show-icon></el-alert>
          <el-form-item label="Name" required prop="name">
            <el-input v-model="serviceToEdit.name" placeholder="The name of your service (Max 50 characters)"></el-input>
          </el-form-item>
          <el-form-item label="Short Description" required prop="shortDescription">
            <el-input type="textarea" v-model="serviceToEdit.shortDescription" placeholder="A brief description of your service (Max 140 characters)"></el-input>
          </el-form-item>
          <el-form-item label="Description">
            <el-input type="textarea" v-model="serviceToEdit.description" placeholder="A detailed description of your service"></el-input>
          </el-form-item>
          <el-form-item label="Categories">
            <el-select v-model="serviceToEdit.categories" multiple placeholder="Categories your service falls under">
              <el-option v-for="item in categories" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Change Current Cover Image" prop="changeImage">
            <el-switch v-model="changeImage" on-text="" off-text="" @change="autoClearEditImage"></el-switch>
          </el-form-item>
          <el-form-item v-if="changeImage" label="Cover Image" prop="coverImage">
            <input type="file" ref="editCoverImage" accept="image/*" @change="editFilechanged"></input>
            <el-button v-if="serviceToEdit.coverImage" @click="resetEditImage">Remove</el-button>
            <span>Current cover image will be removed if this field is empty</span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="editVisible = false">Cancel</el-button>
    <el-button type="primary" @click="editService">Edit</el-button>
  </span>
      </el-dialog>

    </div>
  </div>
</template>


<script>
  import axios from 'axios';
  import { Business } from '../../../services/EndPoints';
  import { serviceRules } from '../../../services/validation';
  import BusinessAuth from '../../../services/auth/businessAuth';

  export default {
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
    mounted() {
      this.getServices();
      this.getCategories();
    },
    methods: {
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
              this.generalErrors = error.response.data.errors.map((err) => {
                if (typeof err === 'string') {
                  return err;
                }
                return err.msg;
              });
            });
      },

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
              this.generalErrors = error.response.data.errors.map((err) => {
                if (typeof err === 'string') {
                  return err;
                }
                return err.msg;
              });
            });
      },
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
              this.deleteErrors = error.response.data.errors.map((err) => {
                if (typeof err === 'string') {
                  return err;
                }
                return err.msg;
              });
            });
      },
      resetCreate() {
        this.$refs.createServiceForm.resetFields();
        this.resetCreateImage();
      },
      resetCreateImage() {
        this.newService.coverImage = '';
        this.$refs.createCoverImage.value = null;
      },
      resetEditImage() {
        this.serviceToEdit.coverImage = '';
        this.$refs.editCoverImage.value = null;
      },
      showEdit(service) {
        this.changeImage = false;
        this.serviceToEdit = service;
        this.editVisible = true;
      },
      showDelete(service) {
        this.serviceToDelete = service;
        this.deleteVisible = true;
      },
      offeringsURL(service) {
        return `/business/edit/${service._id}/offerings`;
      },
      galleryURL(service) {
        return `/business/edit/${service._id}/gallery`;
      },
      couponsURL(service) {
        return `/business/edit/${service._id}/coupons`;
      },
      createFilechanged(e) {
        const files = e.target.files || e.dataTransfer.files;
        if (files.length > 0) {
          this.newService.coverImage = files[0];
        }
      },
      editFilechanged(e) {
        const files = e.target.files || e.dataTransfer.files;
        if (files.length > 0) {
          this.serviceToEdit.coverImage = files[0];
        }
        this.$nextTick();
      },
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
