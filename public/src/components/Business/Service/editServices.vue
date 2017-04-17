<template>
  <div class="main">
    <div class="container">
      <el-card class="create-service">
        <div slot="header" class="clearfix">
          <span>Create Service</span>
        </div>
        <el-alert v-if:"createSuccess" title="Success" type="success" :description="createSuccess" show-icon></el-alert>
        <el-alert v-for"error in errors" :key"error" :title="Error" type="error" :description="error" show-icon></el-alert>
        <el-form ref="createService" :model="newService" :rules="ServiceRules" :label-position="left">
          <el-form-item label="Name" required prop="name">
            <el-input v-model="service.name" placeholder="The name of your service"></el-input>
          </el-form-item>
          <el-form-item label="Short Description" required prop="shortDescription">
            <el-input type="textarea" v-model="service.shortDescription" placeholder="A brief description of your service (Max 140 characters)"></el-input>
          </el-form-item>
          <el-form-item label="Description">
            <el-input type="textarea" v-model="service.shortDescription" placeholder="A detailed description of your service"></el-input>
          </el-form-item>
          <el-form-item label="Categories">
            <el-select v-model="selectedCategories" multiple placeholder="Categories your service falls under">
              <el-option v-for="item in categories" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!--TODO Upload Cover Image-->
          <el-form-item>
            <el-button type="primary" @click="createService">Create</el-button>
            <el-button @click="resetForm('createService')">Reset</el-button>
          </el-form-item>
        </el-form>
      </el-card>
  
    </div>
  </div>
</template>


<script>
  import Axios from 'axios';
  import { Business } from '../../../services/EndPoints';
  import { ServiceRules } from '../../../services/validation';
  
  export default {
    data() {
      return {
        services: [],
        categories: [],
        newService: {},
        generalErrors: [],
        serviceRules: ServiceRules,
        createSuccess: '',
        createErrors: [],
      };
    },
    mounted() {
      this.getServices();
      Axios.get(Business().listCategories)
        .then((response) => {
          this.categories = response.data;
        })
        .catch((err) => {
          this.generalErrors = err.response.data.errors;
        });
    },
    methods: {
      getServices() {
        Axios.get(Business().listServices)
        .then((response) => {
          this.services = response.data;
        })
        .catch((err) => {
          this.generalErrors = err.response.data.errors;
        });
      },
      createService() {
        this.$refs.createService.validate((valid) => {
          if (valid) {
            Axios.post(Business().create, this.newService)
            .then((response) => {
              this.createErrors = [];
              this.createSuccess = response.data.message;
              this.resetForm('createService');
              this.getServices();
            })
            .catch((err) => {
              this.createSuccess = '';
              this.createErrors = err.response.data.errors;
            });
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
  };
</script>
