<template>
  <div class="columns is-mobile">
    <div class="column is-half is-offset-one-quarter">
  
      <div v-show="success">
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
          <el-input v-model="form.firstName" ></el-input>
        </el-form-item>
  
        <el-form-item label="Last Name" prop="lastName">
          <el-input v-model="form.lastName" ></el-input>
        </el-form-item>
  
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" ></el-input>
        </el-form-item>
  
        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" :type="showPassword" placeholder="***************">
            <div slot="append">
              <el-tooltip content="See Password" placement="right">
                <el-button @click="onShowPasswrod"><i class="fa fa-eye"></i></el-button>
              </el-tooltip>
            </div>
          </el-input>
        </el-form-item>
  
        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" :type="showConfirm" placeholder="***************">
            <div slot="append">
              <el-tooltip content="See Confirm Password" placement="right">
                <el-button @click="onShowConfirmPasswrod"><i class="fa fa-eye"></i></el-button>
              </el-tooltip>
            </div>
          </el-input>
        </el-form-item>
  
        <el-form-item label="Mobile" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
  
        <el-form-item label="Gender" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="Male"></el-radio>
            <el-radio label="Female"></el-radio>
          </el-radio-group>
        </el-form-item>
  
        <el-form-item label="Birthdate">
          <el-date-picker v-model="form.birthdate" type="date" :format="'dd-MM-yyyy'"></el-date-picker>
        </el-form-item>
  
        <el-form-item class="has-text-centered">
          <el-button type="primary" icon="circle-check" @click="onClick" :loading="loading">Sign Up</el-button>
          <el-button icon="circle-cross" @click="onReset">Reset</el-button>
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
  import {
    clientEditInfoValidation
  } from '../../services/validation';
  export default {
    data() {
      console.log(clientEditInfoValidation);
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
        showPassword: 'password',
        showConfirm: 'password',
        success: false,
        successMessage: '',
        clientEmail: '',
        loading: false,
      }
    },
    computed: {
      dataGetter: function(){
        axios.get(EndPoints.Client)
        .then((res) => {

        })
        .catch((err) => {

        });
      }
    },
    methods: {
      onShowPasswrod(){
        if( this.showPasswrod === 'text'){
          this.showPasswrod = 'password';
        } else {
          this.showPasswrod = 'text';
        }
      },
      onShowConfirmPasswrod(){
        if( this.showConfirm === 'text'){
          this.showConfirm = 'password';
        } else {
          this.showConfirm = 'text';
        }
      },
      onClick() {
        if (this.hasErrors()) {
          return;
        }
        this.success = false;
        this.successMessage = '';
        this.clientEmail = this.form.email;
        this.loading = true;
        this.form.post(EndPoints.Client().signup)
          .then((data) => {
            this.loading = false;
            this.success = true;
            this.successMessage = data.message;
          }).catch(() => this.loading = false);
      },
      onReset() {
        this.$refs.form.resetFields();
      },
      hasErrors() {
        const errors = this.$refs.form.$children.filter(el => el.validateMessage.length > 0);
        return errors.length > 0;
      },
      resendMail() {
        this.loading = true;
        this.form.email = this.clientEmail;
        this.form.post(EndPoints.Client().resend)
          .then((data) => {
            this.loading = false;
            this.success = true;
            this.successMessage = data.message;
          }).catch(err => this.loading = false);
      },
    },
  }
</script>
