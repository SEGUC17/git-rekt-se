<template>
  <div class="main">
    <div class="container">
      <el-card class="create-service">
      <el-alert v-for="error in generalErrors" type="error" :title="error" show-icon></el-alert>
        <div slot="header" class="clearfix">
          <span>Create Service</span>
        </div>
        <el-alert v-if="createSuccess" type="success" :title="createSuccess" show-icon></el-alert>
        <el-alert v-if="editSuccess" type="success" :title="editSuccess" show-icon></el-alert>
        <el-alert v-if="deleteSuccess" type="success" :title="deleteSuccess" show-icon></el-alert>
        <el-alert v-for="error in createErrors" type="error" :title="error" show-icon></el-alert>
        <el-form :model="newService" ref="createService" :rules="serviceRules" label-position="left">
          <el-form-item label="Name" required prop="name">
            <el-input v-model="newService.name" placeholder="The name of your service"></el-input>
          </el-form-item>
          <el-form-item label="Short Description" required prop="shortDescription">
            <el-input type="textarea" v-model="newService.shortDescription" placeholder="A brief description of your service (Max 140 characters)"></el-input>
          </el-form-item>
          <el-form-item label="Description">
            <el-input type="textarea" v-model="newService.description" placeholder="A detailed description of your service"></el-input>
          </el-form-item>
          <el-form-item label="Categories">
            <el-select v-model="newService.categories" multiple placeholder="Categories your service falls under">
              <el-option v-for="item in categories" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!--TODO Upload Cover Image-->
          <el-form-item class="is-pulled-right">
            <el-button type="primary" @click="createService">Create</el-button>
            <el-button @click="resetCreate">Clear</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <div class="services-list">
        <el-card class="service-card" v-for="service in services" :key="service.id">
          <span>{{service.name}}</span>
          <div class="service-buttons is-pulled-right">
            <router-link tag="el-button" :to="offeringsURL(service)"> <i class="el-icon-document"></i>Edit Offerings</router-link>
            <router-link tag="el-button" :to="galleryURL(service)"><i class="el-icon-picture"></i> Edit Gallery</router-link>
            <el-button icon="edit" @click="showEdit(service)">
              Edit Service
            </el-button>
            <el-button icon="delete" @click="showDelete(service)" type="danger">
              Delete Service
            </el-button>
          </div>
        </el-card>
      </div>
    </div>
     <el-dialog title="Edit Service" v-model="editVisible" size="large">
    <el-form ref="editService" :model="serviceToEdit" :rules="serviceRules" label-position="left">
      <el-alert v-for="error in editErrors" type="error" :title="error" show-icon></el-alert>
          <el-form-item label="Name" required prop="name">
            <el-input v-model="serviceToEdit.name" placeholder="The name of your service"></el-input>
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
          <!--TODO Upload Cover Image-->
        </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editVisible = false">Cancel</el-button>
    <el-button type="primary" @click="editService">Edit</el-button>
  </span>
</el-dialog>
<el-dialog title="Delete Service" v-model="deleteVisible" size="small">
  <span>This cannot be undone. Delete this service?</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="deleteVisible = false">Cancel</el-button>
    <el-button type="danger" @click="deleteService(service)">Delete</el-button>
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
        newService: {},
        generalErrors: [],
        serviceRules,
        createSuccess: '',
        createErrors: [],
        serviceToEdit: {},
        editVisible: false,
        editSuccess: '',
        editErrors: [],
        serviceToDelete: {},
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
          this.categories = response.data;
        })
        .catch((err) => {
          this.generalErrors = err.response.data.errors;
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
        .catch((err) => {
          loader.close();
          this.generalErrors = err.response.data.errors;
        });
      },
      createService() {
        this.createSuccess = '';
        this.createErrors = [];
        this.$refs.createService.validate((valid) => {
          if (valid) {
            const loader = this.$loading({
              fullscreen: true,
            });
            Axios.post(Business().createService, this.newService, {
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
              this.errors = error.errors.map((err) => {
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
            Axios.post(Business().editService(this.serviceToEdit._id), this.serviceToEdit, {
              headers: {
                Authorization: BusinessAuth.getJWTtoken(),
              },
            })
            .then((response) => {
              this.editSuccess = response.data.message;
              this.editVisible = false;
              loader.close();
              this.getServices();
            })
            .catch((error) => {
              loader.close();
              this.errors = error.errors.map((err) => {
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
        Axios.post(Business().deleteService(this.serviceToDelete._id), this.serviceToDelete, {
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
          this.errors = error.errors.map((err) => {
            if (typeof err === 'string') {
              return err;
            }
            return err.msg;
          });
        });
      },
      resetCreate() {
        this.$refs.createService.resetFields();
      },
      showEdit(service) {
        this.serviceToEdit = service;
        this.editVisible = true;
      },
      showDelete(service) {
        this.serviceToDelete = service;
        this.deleteVisible = true;
      },
      offeringsURL(service) {
        return `/business/edit/${service.id}/offerings`;
      },
      galleryURL(service) {
        return `/business/edit/${service.id}/gallery`;
      },
    },
  };
</script>
