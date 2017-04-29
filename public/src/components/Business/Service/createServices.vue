<!--suppress JSUnresolvedFunction, JSUnresolvedVariable -->
<template>
  <div class="box create-service">

    <!-- Service Created-->
    <el-alert class="error" v-if="createSuccess"
              @click="createSuccess = false"
              type="success" :title="createSuccess" show-icon>
    </el-alert>

    <!-- General Errors -->
    <div class="errors">
      <el-alert v-for="error in generalErrors" :key="error"
                type="error" :title="error"
                class="error" show-icon
                @close="generalErrors.splice(error, 1)">
      </el-alert>
    </div>

    <!-- Service Creation Errors-->
    <div class="errors">
      <el-alert v-for="error in createErrors" :key="error"
                type="error" :title="error"
                class="error" show-icon
                @close="createErrors.splice(error, 1)">
      </el-alert>
    </div>

    <!-- Create Service Form -->
    <el-form :model="newService" ref="createServiceForm" :rules="serviceRules">
      <el-form-item label="Name" prop="name">
        <el-input v-model="newService.name"
                  placeholder="Service Name (Max 50 characters)"></el-input>
      </el-form-item>
      <el-form-item label="Short Description" prop="shortDescription">
        <el-input type="textarea" v-model="newService.shortDescription"
                  placeholder="Brief description of the service (Max 140 characters)"></el-input>
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input type="textarea" v-model="newService.description"
                  placeholder="Detailed description of your service"></el-input>
      </el-form-item>
      <el-form-item label="Categories" prop="categories">
        <el-select v-model="newService.categories" multiple :multiple-limit="3">
          <el-option v-for="item in categories" :key="item.value" :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Cover Image" prop="coverImage">
        <input type="file" ref="createCoverImage" accept="image/*" @change="createFilechanged"/>
        <el-button v-if="newService.coverImage" @click="resetCreateImage">Remove</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="createService">Create</el-button>
        <el-button @click="resetCreate">Clear</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
 /**
  * This component allows a business to create a service.
  */
  import axios from 'axios';
  import BusinessAuth from '../../../services/auth/businessAuth';
  import {
    Business,
    Visitor } from '../../../services/EndPoints';
  import { serviceRules } from '../../../services/validation';
  import JWTCheck from '../../../services/JWTErrors';

  export default {
    /**
     * Data used by this component.
     * generalErrors: Array of errors received from server.
     * categories: Array of categories.
     * createSuccess: Success Message when creating service is successful.
     * newService: Data entered by user to create new service.
     * serviceRules: Validation Rules used to validate the data.
     */
    data() {
      return {
        generalErrors: [],
        categories: [],
        createSuccess: '',
        createErrors: [],
        newService: {
          name: '',
          shortDescription: '',
          description: '',
          categories: '',
          coverImage: '',
        },
        serviceRules,
      };
    },
    /**
     * Ran when component is mounted on DOM.
     * List all categories.
     */
    mounted() {
      this.getCategories();
    },

    methods: {
      /**
       * Get the possible categories.
       */
      getCategories() {
        const loader = this.$loading({
          fullscreen: true,
        });
        axios.get(Visitor().serviceCategories)
            .then((response) => {
              this.categories = response.data.categories;
              loader.close();
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
       * Create a new service.
       */
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
            axios.post(Business().createService, newForm, {
              headers: {
                Authorization: BusinessAuth.getJWTtoken(),
              },
            }).then((response) => {
              loader.close();
              this.createSuccess = response.data.message;
              this.resetCreate();
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
                    this.generalErrors = error.response.data.errors.map((err) => {
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
       * Reset create form.
       */
      resetCreate() {
        this.$refs.createServiceForm.resetFields();
        this.resetCreateImage();
      },
      /**
       * Reset Service Icon Image upload.
       */
      resetCreateImage() {
        this.newService.coverImage = '';
        this.$refs.createCoverImage.value = null;
      },
      /**
       * Handle file upload.
       */
      createFilechanged(e) {
        const files = e.target.files || e.dataTransfer.files;
        if (files.length > 0) {
          this.newService.coverImage = files[0];
        }
      },

    },
  };
</script>
