<template>
  <div class="business-edit-listing-info box">

    <!-- Errors -->
    <div class="errors" v-if="errors.length > 0">
      <div class="error" v-for="(error, index) in errors">
        <el-alert class="error" :title="error" type="error" show-icon
                  @close="closeError(index)">
        </el-alert>
      </div>
    </div>

    <!-- Success -->
    <div class="errors" v-if="success">
      <el-alert @close="success = false" class="error" :title="editSuccess" type="success" show-icon></el-alert>
    </div>


    <!-- Edit Information Form -->
    <el-form :model="infoForm" :rules="form1Rules" ref="infoForm"
             label-position="top">

      <el-form-item label="Description" prop="description">
        <el-input type="textarea" :autosize="{ minRows: 5}"
                  v-model="infoForm.description"></el-input>
      </el-form-item>

      <el-form-item label="Working hours" prop="workingHours">
        <el-input type="textarea" :autosize="{ minRows: 3}"
                  v-model="infoForm.workingHours"></el-input>
      </el-form-item>

      <el-form-item label="Categories" prop="categories">
        <el-select v-model="infoForm.categories" multiple :multiple-limit="3"
                   placeholder="Select">
          <el-option v-for="category in categories" :key="category._id"
                     :label="category.title"
                     :value="category._id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('infoForm')">Update</el-button>
        <el-button @click="loadFormData">Reset</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
 /**
  * This component is responsible for Editing the Business Info.
  */
  import axios from 'axios';
  import Form from '../../services/Form';
  import { infoFormRules } from '../../services/validation';
  import { Visitor, Business } from '../../services/EndPoints';
  import businessAuth from '../../services/auth/businessAuth';
  import JWTCheck from '../../services/JWTErrors';

  export default {
    /**
     * Data used by this component.
     * infoForm: Holds data entered by user and sent to the server.
     * loader: The Loader Object to display loading.
     * categories: Array of Categories.
     * errors: Errors received from the server.
     * form1Rules: Validation rules used to validate the input.
     * success: true if an operation completed successfully, false otherwise.
     * editSuccess: Message to display user on success.
     */
    data() {
      return {
        infoForm: new Form({
          description: '',
          workingHours: '',
          categories: [],
        }),
        loader: '',
        categories: [],
        errors: [],
        form1Rules: infoFormRules,
        success: false,
        editSuccess: '',
      };
    },
    /**
     * Ran when component is mounted.
     * Loads the form and fills it with the Business Data.
     */
    mounted() {
      this.loadFormData();
    },
    /**
     * All Methods used by the user.
     */
    methods: {
      /**
       * Close and removes a specific error.
       */
      closeError(idx) {
        this.errors.splice(idx, 1);
      },
      /**
       * Load Previous business information.
       */
      loadFormData() {
        this.errors = [];
        this.loader = this.$loading({
          fullscreen: true,
        });
        axios.get(Business().businessInfo, {
          headers: {
            Authorization: businessAuth.getJWTtoken(),
          },
        }).then((infoResponse) => {
          axios.get(Visitor().businessCategories).then((categoriesResponse) => {
            this.loader.close();
            this.categories = categoriesResponse.data.results;

            this.infoForm.description = infoResponse.data.results.description;
            this.infoForm.workingHours = infoResponse.data.results.workingHours;
            this.infoForm.categories = infoResponse.data.results.categories;
            this.infoForm.categories = infoResponse.data.results
                .categories.map(cat => cat._id);
          }).catch((e) => {
            this.loader.close();
            if(e.response && JWTCheck(e.response.data.errors)) {
              businessAuth.removeData();
              this.$router.push('/');
              this.$toast.open({
                text: 'Your sessions has expired. Please login.',
                position: 'bottom',
                type: 'danger'
              });
            } else {
              this.errors = e.response.data.errors;
            }
          });
        }).catch((e) => {
          this.loader.close();
          if(e.response && JWTCheck(e.response.data.errors)) {
              businessAuth.removeData();
              this.$router.push('/');
              this.$toast.open({
                text: 'Your sessions has expired. Please login.',
                position: 'bottom',
                type: 'danger'
              });
            } else {
              this.errors = e.response.data.errors;
            }
        });
      },
      /**
       * Update the business information.
       */
      submitForm(formName) {
        this.errors = [];
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loader = this.$loading({
              fullscreen: true,
            });
            axios.put(Business().editInfo, this.infoForm.data(), {
              headers: {
                Authorization: businessAuth.getJWTtoken(),
              },
            }).then((response) => {
              this.loader.close();
              this.success = true;
              this.editSuccess = response.data.message;
            }).catch((e) => {
              this.loader.close();
              if(e.response && JWTCheck(e.response.data.errors)) {
                businessAuth.removeData();
                this.$router.push('/');
                this.$toast.open({
                  text: 'Your sessions has expired. Please login.',
                  position: 'bottom',
                  type: 'danger'
                });
              } else {
                this.errors = e.response.data.errors;
              }
            });
          }
        });
      },
    },
  };
</script>
