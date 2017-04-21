<template>
  <div class="main">
    <div class="container">
      <el-card class="create-service">
      <el-alert v-for="error in generalErrors" :key="error" type="error" :title="error" show-icon></el-alert>
        <div slot="header" class="clearfix">
          <span>Create Service</span>
        </div>
        <el-alert v-if="createSuccess" type="success" :title="createSuccess" show-icon></el-alert>
        <el-alert v-if="editSuccess" type="success" :title="editSuccess" show-icon></el-alert>
        <el-alert v-if="deleteSuccess" type="success" :title="deleteSuccess" show-icon></el-alert>
        <el-alert v-for="error in createErrors" :key="error" type="error" :title="error" show-icon></el-alert>
        <el-form :model="newService" ref="createServiceForm" :rules="serviceRules">
          <el-form-item label="Name" prop="name">
            <el-input v-model="newService.name" placeholder="The name of your service (Max 50 characters)"></el-input>
          </el-form-item>
          <el-form-item label="Short Description" prop="shortDescription">
            <el-input type="textarea" v-model="newService.shortDescription" placeholder="A brief description of your service (Max 140 characters)"></el-input>
          </el-form-item>
          <el-form-item label="Description" prop="description">
            <el-input type="textarea" v-model="newService.description" placeholder="A detailed description of your service"></el-input>
          </el-form-item>
          <el-form-item label="Categories" prop="categories">
            <el-select v-model="newService.categories" multiple placeholder="Categories your service falls under">
              <el-option v-for="item in categories" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Cover Image" prop="coverImage">
            <input type="file" ref="createCoverImage" accept="image/*" @change="createFilechanged"></input>
            <el-button v-if="newService.coverImage" @click="resetCreateImage">Remove</el-button>
          </el-form-item>
          <el-form-item class="is-pulled-right">
            <el-button type="primary" @click="createService">Create</el-button>
            <el-button @click="resetCreate">Clear</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <div class="services-list">
        <el-table :data="services" :show-header="false" style="width: 100%">
          <el-table-column prop="name" width="500">
          </el-table-column>
          <el-table-column align="right">
            <template scope="scope">
                 <div class="service-buttons">
                  <router-link tag="el-button" :to="offeringsURL(scope.row)"> <i class="el-icon-document"></i>Edit Offerings</router-link>
                  <router-link tag="el-button" :to="couponsURL(scope.row)"><i class="fa fa-percent"></i> Edit Coupons</router-link>
                  <router-link tag="el-button" :to="galleryURL(scope.row)"><i class="el-icon-picture"></i> Edit Gallery</router-link>
                  <el-button icon="edit" @click="showEdit(scope.row)">
                    Edit Service
                  </el-button>
                  <el-button icon="delete" @click="showDelete(scope.row)" type="danger">
                    Delete Service
                  </el-button>
                </div>
                </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
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
<el-dialog title="Delete Service" v-model="deleteVisible" size="small">
  <span>This cannot be undone. Delete this service and its associated offerings, gallery, coupons and bookings?</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="deleteVisible = false">Cancel</el-button>
    <el-button type="danger" @click="deleteService">Delete</el-button>
  </span>
</el-dialog>
  </div>
</template>


<script>
  import Axios from 'axios';
  import { Business } from '../../../services/EndPoints';
  import { serviceRules } from '../../../services/validation';
  import BusinessAuth from '../../../services/auth/businessAuth';
  
  export default {
    data() {
      return {
        services: [],
        categories: [],
        newService: {
          name: '',
          shortDescription: '',
          description: '',
          categories: '',
          coverImage: '',
        },
        generalErrors: [],
        serviceRules,
        createSuccess: '',
        createErrors: [],
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
      Axios.get(Business().listCategories, {
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
    methods: {
      getServices() {
        const loader = this.$loading({
          fullscreen: true,
        });
        Axios.get(Business().listServices, {
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
      createService() {
        this.createSuccess = '';
        this.createErrors = [];
        this.$refs.createServiceForm.validate((valid) => {
          if (valid) {
            const loader = this.$loading({
              fullscreen: true,
            });
            const newForm = new FormData();
            newForm.append('name', this.newService.name);
            newForm.append('shortDescription', this.newService.shortDescription);
            newForm.append('description', this.newService.description);
            this.newService.categories.forEach((category) => {
              newForm.append('categories[]', category);
            }, this);
            newForm.append('coverImage', this.newService.coverImage);
            Axios.post(Business().createService, newForm, {
              headers: {
                Authorization: BusinessAuth.getJWTtoken(),
              },
            })
            .then((response) => {
              loader.close();
              this.createSuccess = response.data.message;
              this.resetCreate();
              this.getServices();
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
            Axios.post(Business().editService(this.serviceToEdit._id), editForm, {
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
        Axios.post(Business().deleteService(this.serviceToDelete._id), null, {
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
