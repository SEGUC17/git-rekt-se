<template>
    <div class="verified-signup">

        <gr-top-hero class="verified-signup-top"
                     title="Complete Signup"
                     subtitle="One more final step to obtain your account">
        </gr-top-hero>

        <div class="columns is-mobile">
           <div class="column is-half-desktop is-10-mobile is-10-tablet is-offset-1-mobile
                is-offset-1-tablet is-offset-one-quarter-desktop">

               <div class="errors" v-show="errors.length > 0">
                   <el-alert v-for="error in errors" class="error" :title="error"
                             type="error" :key="error" show-icon>
                   </el-alert>
               </div>

               <div class="errors" v-show="success">
                   <el-alert :title="signupSuccess" type="success" class="error" show-icon>
                   </el-alert>
               </div>

               <el-form :model="form" :rules="rules" ref="form" label-width="120px" label-position="top"
                        class="demo-ruleForm">

                   <el-form-item label="Password" prop="password">
                       <el-input v-model="form.password" type="password"></el-input>
                   </el-form-item>

                   <el-form-item label="Confirm Password" prop="confirmPassword">
                       <el-input v-model="form.confirmPassword" type="password"></el-input>
                   </el-form-item>

                   <el-form-item label="Description" prop="description">
                       <el-input type="textarea" :autosize="{ minRows: 2}" v-model="form.description"></el-input>
                   </el-form-item>

                   <el-form-item label="Working hours" prop="workingHours">
                       <el-input type="textarea" :autosize="{ minRows: 1}" v-model="form.workingHours"></el-input>
                   </el-form-item>

                   <el-form-item label="Categories" prop="categories">
                       <el-select v-model="form.categories" multiple :multiple-limit="3" placeholder="Select">
                           <el-option v-for="category in categories" :key="category._id" :label="category.title"
                                      :value="category._id">
                           </el-option>
                       </el-select>
                   </el-form-item>

                   <el-form-item class="location-select" v-for="(branch, index) in form.branches" :key="index" :label="'Branch '+(index+1)"
                                 prop="branches">
                       <el-input placeholder="Please Enter Address here" v-model="branch.address">
                           <el-select v-model="branch.location" placeholder="Location" slot="prepend">
                               <el-option v-for="location in locations" :key="location.value" :label="location.label"
                                          :value="location.value">
                               </el-option>
                           </el-select>
                           <el-button @click="removeBranch(index)" slot="append">Delete Branch</el-button>
                       </el-input>
                       <el-button style="margin-top: 0.5em;" v-show="index === form.branches.length-1"
                                  @click="addBranch">New Branch</el-button>
                   </el-form-item>


                   <el-form-item>
                       <el-button type="primary" @click="submitForm('form')" :loading="loading">Complete</el-button>
                       <el-button @click="resetForm('form')">Reset</el-button>
                   </el-form-item>

               </el-form>
           </div>
        </div>
    </div>

</template>

<script>
  import axios from 'axios';
  import Form from '../../services/Form';
  import { verifiedBusinessSignupRules } from '../../services/validation';
  import { Visitor } from '../../services/EndPoints';
  import businessAuth from '../../services/auth/businessAuth';
  import commonAuth from '../../services/auth/commonAuth';

  export default {
    data() {
      verifiedBusinessSignupRules.confirmPassword[1].validator = verifiedBusinessSignupRules
                .confirmPassword[1].validator.bind(this);
      verifiedBusinessSignupRules.password[2].validator = verifiedBusinessSignupRules.password[2]
          .validator.bind(this);
      return {
        form: new Form({
          password: '',
          confirmPassword: '',
          description: '',
          workingHours: '',
          categories: [],
          branches: [{
            location: '',
            address: '',
          }],
        }),
        categories: [],
        locations: [],
        loading: false,
        errors: [],
        success: false,
        signupSuccess: '',
        rules: verifiedBusinessSignupRules,
      };
    },
    mounted() {
      if (commonAuth.isAuthenticated()) {
        this.$router.push('/');
        return;
      }
      this.getLocations();
      axios.get(Visitor().businessCategories).then((response) => {
        this.categories = response.data.results;
      }).catch((e) => {
        this.errors = e;
      });
    },
    methods: {
      getLocations() {
        axios
            .get(Visitor().locations)
            .then((res) => {
              this.locations = res.data;
            });
      },
      submitForm(formName) {
        this.form.branches = this.form.branches.filter(branch => branch.location !== '' && branch.address !== '');
        this.errors = [];
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            businessAuth.verifiedsignup(this.$route.params.token,
                this.form.data(), (responseErrs, response) => {
                  this.loading = false;
                  if (responseErrs) {
                    this.errors = responseErrs.errors.map((err) => {
                      if (typeof err === 'string') {
                        return err;
                      }
                      return err.msg;
                    });
                  } else {
                    this.success = true;
                    this.signupSuccess = response.message;
                    setTimeout(() => {
                      this.$router.push('/business/login');
                    }, 1000);
                  }
                });
          } else {
            this.addBranch();
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.form.branches = [];
        this.addBranch();
      },
      addBranch() {
        this.form.branches.push({
          location: '',
          address: '',
        });
      },
      removeBranch(idx) {
        this.form.branches = this.form.branches.filter((branch, index) => idx !== index);
        if (this.form.branches.length === 0) {
          this.addBranch();
        }
      },
    },
  };
</script>

<style>
    .location-select .el-input-group__prepend{
        width: 25%;
    }
    .verified-signup-top{
        background: #E44D26;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #F16529, #E44D26);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #F16529, #E44D26); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }
    .error {
        margin-bottom: 20px;
    }

    .demo-ruleForm {
        margin-top: 30px;
        margin-bottom: 40px;
    }
</style>