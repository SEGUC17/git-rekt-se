<template>
  <div class="columns is-mobile">
    <div class="column is-half is-offset-one-quarter">
  
      <div class="message" v-show="success">
        <el-alert title="Success" type="success" :description="successMessage" show-icon></el-alert>
      </div>
  
      <div v-show="!form.errors.isEmpty()">
        <div class="error" v-for="key in form.keys" v-show="form.errors.has(key)">
          <el-alert @close="form.errors.remove(key)" :title="key.toUpperCase()" type="error" :description="form.errors.getAll(key, ' | ')" show-icon></el-alert>
        </div>
  
        <div class="error" v-show="form.errors.has('serverError')">
          <el-alert @close="" :title="form.errors.getAll('serverError')" type="error" show-icon></el-alert>
        </div>
      </div>
  
      <h1 class="title has-text-centered">Edit Information</h1>
  
      <el-form ref="form" :model="form" :rules="rules" :label-position="'left'" label-width="120px">
        <el-form-item label="First Name" prop="firstName">
          <el-input v-model="form.firstName"></el-input>
        </el-form-item>
  
        <el-form-item label="Last Name" prop="lastName">
          <el-input v-model="form.lastName"></el-input>
        </el-form-item>
  
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
  
        <el-form-item label="Password">
          <el-input v-model="form.password" :type="showPassword" prop="password" placeholder="***************">
            <div slot="append">
              <el-tooltip content="See Password" placement="right">
                <el-button @click="onShowPassword"><i class="fa fa-eye"></i></el-button>
              </el-tooltip>
            </div>
          </el-input>
        </el-form-item>
  
        <el-form-item label="Confirm Password">
          <el-input v-model="form.confirmPassword" :type="showConfirm" prop="confirmPassword" placeholder="***************">
            <div slot="append">
              <el-tooltip content="See Confirm Password" placement="right">
                <el-button @click="onShowConfirmPassword"><i class="fa fa-eye"></i></el-button>
              </el-tooltip>
            </div>
          </el-input>
        </el-form-item>
  
        <el-form-item label="Mobile" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
  
        <el-form-item label="gender" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="Male"></el-radio>
            <el-radio label="Female"></el-radio>
          </el-radio-group>
        </el-form-item>
  
        <el-form-item label="birthdate">
          <el-date-picker v-model="form.birthdate" type="date" :format="'dd-MM-yyyy'"></el-date-picker>
        </el-form-item>
  
        <el-form-item class="has-text-centered">
          <el-button type="primary" icon="circle-check" @click="submitForm('form')">Edit</el-button>
        </el-form-item>
      </el-form>
  
    </div>
  </div>
</template>

<script>
  import Form from '../../services/Form';
  import Errors from '../../services/Errors';
  import EndPoints from '../../services/EndPoints';
  import axios from 'axios';
  import clientAuth from '../../services/auth/clientAuth';
  import {
    clientEditInfoValidation
  } from '../../services/clientEditInfoValidation';
  export default {
    data() {
  
      clientEditInfoValidation.confirmPassword[0].validator = clientEditInfoValidation.confirmPassword[0]
        .validator.bind(this);
      return {
        form: new Form({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          gender: '',
          mobile: '',
          birthdate: ''
        }),
        rules: clientEditInfoValidation,
        client: {},
        showPassword: 'password',
        showConfirm: 'password',
        success: false,
        successMessage: '',
      }
    },
    mounted: function() {
      this.getClient()
        .then(() => {
          this.form.email = this.client.email;
          this.form.confirmPassword = this.client.confirmPassword;
          this.form.firstName = this.client.firstName;
          this.form.lastName = this.client.lastName;
          this.form.gender = this.client.gender;
          this.form.mobile = this.client.mobile;
          this.form.birthdate = this.client.birthdate;
        })
        .catch(() => {
          this.error = true;
          this.message = err.response ? err.response.data.errors.join(' | ') : err.message;
        });
    },
    methods: {
      onShowPassword() {
        if (this.showPasswrod === 'text') {
          this.showPasswrod = 'password';
        } else {
          this.showPasswrod = 'text';
        }
      },
      onShowConfirmPassword() {
        if (this.showConfirm === 'text') {
          this.showConfirm = 'password';
        } else {
          this.showConfirm = 'text';
        }
      },
      getClient() {
        return new Promise((resolve, reject) => {
          axios.get(EndPoints.Client().getInfo(clientAuth.user.userID()), {
              headers: {
                Authorization: clientAuth.getJWTtoken(),
              },
            })
            .then((response) => {
              this.client = response.data;
              resolve();
            }).catch((err) => {
              this.error = true;
              this.message = err.response ? err.response.data.errors.join(' | ') : err.message;
              reject(err);
            });
        });
      },
      submitForm(formName) {
  
        this.success = false;
        this.successMessage = '',
          this.$refs[formName].validate((valid) => {
            if (valid) {
              console.log("valid")
              this.form.post(EndPoints.Client().editInfo(clientAuth.user.userID()), {
                  headers: {
                    Authorization: clientAuth.getJWTtoken(),
                  },
                })
                .then((data) => {
                  this.success = true;
                  this.successMessage = data.message;
                }).catch((err) => {
                  console.log(err);
                  this.error = true;
                  this.message = err.response ? err.response.data.errors.join(' | ') : err.message;
                });
            } else{
              this.error = true;
              this.message = ["Please insert correct inputs"];
            }
          });
      },
      hasErrors() {
        const errors = this.$refs.form.$children.filter(el => el.validateMessage.length > 0);
        return errors.length > 0;
      },
    },
  }
</script>

<style>
  .error {
    margin-bottom: 10px;
  }
  .message {
    margin-bottom: 10px;
  }
</style>
