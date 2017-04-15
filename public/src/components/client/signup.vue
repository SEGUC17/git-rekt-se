<template>
  <div class="columns is-mobile">
    <div class="column is-half is-offset-one-quarter">
  
      <div v-show="success">
        <el-alert title="Success" type="success" :description="successMessage" show-icon></el-alert>
        <div class="has-text-centered">
          <el-button type="text" @click="resendMail">Resend Mail!</el-button>
        </div>
      </div>
  
      <div v-show="!form.errors.isEmpty()">
        <div class="error" v-for="key in form.keys" v-show="form.errors.has(key)">
          <el-alert @close="form.errors.remove(key)" :title="key.toUpperCase()" type="error" :description="form.errors.getAll(key, ' | ')" show-icon></el-alert>
        </div>
  
        <div class="error" v-show="form.errors.has('serverError')">
          <el-alert @close="" title="Server Errors" :description="form.errors.getAll('serverError')" type="error" show-icon></el-alert>
        </div>
      </div>
  
      <h1 class="title has-text-centered">Sign Up</h1>
  
      <el-form ref="form" :model="form" :rules="rules" :label-position="'left'" label-width="120px">
        <el-form-item label="First Name" prop="firstName">
          <el-input v-model="form.firstName" placeholder="A Name"></el-input>
        </el-form-item>
  
        <el-form-item label="Last Name" prop="lastName">
          <el-input v-model="form.lastName" placeholder="Another Name"></el-input>
        </el-form-item>
  
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="generic_email@somedomain.com"></el-input>
        </el-form-item>
  
        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" :type="showPassword" placeholder="********">
            <el-button slot="append" @mousedown.native="showPassword = 'text'" @mouseup.native="showPassword = 'password'"><i class="fa fa-eye"></i></el-button>
          </el-input>
        </el-form-item>
  
        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" :type="showConfirm" placeholder="********">
            <el-button slot="append" @mousedown.native="showConfirm = 'text'" @mouseup.native="showConfirm = 'password'"><i class="fa fa-eye"></i></el-button>
          </el-input>
        </el-form-item>
  
        <el-form-item label="Mobile" prop="mobile">
          <el-input v-model="form.mobile" placeholder="01001234567"></el-input>
        </el-form-item>
  
        <el-form-item label="Gender" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio label="Male"></el-radio>
            <el-radio label="Female"></el-radio>
          </el-radio-group>
        </el-form-item>
  
        <el-form-item label="Birthdate">
          <el-date-picker v-model="form.birthdate" type="date" :format="'dd-MM-yyyy'" placeholder="1/1/1990"></el-date-picker>
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
  import {
    clientSignUpValidation
  } from '../../services/validation';
  export default {
    data() {
      clientSignUpValidation.confirmPassword[1].validator = clientSignUpValidation.confirmPassword[1]
        .validator.bind(this);
      clientSignUpValidation.password[2].validator = clientSignUpValidation.password[2]
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
        rules: clientSignUpValidation,
        showPassword: 'password',
        showConfirm: 'password',
        success: false,
        successMessage: '',
        clientEmail: '',
        loading: false,
      }
    },
    methods: {
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
        console.log(this.clientEmail);
      },
    },
  }
</script>

<style>
  .error+.error {
    margin-top: 10px;
  }
</style>