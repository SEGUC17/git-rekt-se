<template>
  <div class="columns is-mobile">
    <div class="column is-half is-offset-one-quarter">
  
      <div v-show="!form.errors.isEmpty()">
        <div v-for="key in form.keys" v-show="form.errors.has(key)">
          <el-alert :title="key.toUpperCase()" type="error" :description="form.errors.getFirst(key)" show-icon></el-alert>
          <br>
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
          <el-input v-model="form.password" type="password" placeholder="********"></el-input>
        </el-form-item>
  
        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" placeholder="********"></el-input>
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
          <el-button type="primary" icon="circle-check" @click="onClick">Sign Up</el-button>
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
      }
    },
    methods: {
      onClick() {
        console.log(this.form.data());
        this.form.post(EndPoints.Client().signup)
          .then((data) => console.log(data))
          .catch((err) => {
            console.log(err);
            console.log(this.form.errors);
            console.log(this.form.errors.get('email'));
            this.errors = this.form.errors;
            console.log(this.errors);
          });
      },
    },
  }
</script>