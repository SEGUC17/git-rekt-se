<template>
  <div class="columns is-mobile">
    <div class="column is-half is-offset-one-quarter">
  
      <div v-show="success">
        <el-alert @close="success = false" title="Success" :description="message" type="success" show-icon></el-alert>
      </div>
  
      <div v-show="!form.errors.isEmpty()">
        <div v-show="error">
          <el-alert @close="error = false" title="Error" type="error" :description="message" show-icon></el-alert>
        </div>
  
        <div class="error" v-for="key in form.keys" v-show="form.errors.has(key)">
          <el-alert @close="form.errors.remove(key)" :title="key.toUpperCase()" type="error" :description="form.errors.getAll(key, ' | ')" show-icon></el-alert>
        </div>
  
        <div class="error" v-show="form.errors.has('serverError')">
          <el-alert @close="" title="Server Errors" :description="form.errors.getAll('serverError')" type="error" show-icon></el-alert>
        </div>
      </div>
  
      <h1 class="title has-text-centered">Edit Basic Information</h1>
  
      <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="120px">
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
  
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
  
        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
  
        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password"></el-input>
        </el-form-item>
  
        <el-form-item label="Short Description" prop="shortDescription">
          <el-input v-model="form.shortDescription"></el-input>
        </el-form-item>
  
        <el-form-item v-for="el in phoneNumbers" :key="el.key" label="Phone Numbers" prop="phoneNumber">
          <el-input v-model="el.number"></el-input>
        </el-form-item>
  
        <el-form-item class="has-text-centered">
          <el-button type="primary" icon="edit" @click="onSubmit" :loading="loading">Edit</el-button>
          <el-button icon="plus" @click="addPhone">Add Phone</el-button>
          <el-button icon="circle-cross" @click="onReset">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Form from '../../services/Form';
  import {
    Business
  } from '../../services/EndPoints';
  import {
    businessEditInfoValidation
  } from '../../services/validation';
  const dummy_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ZWQyZmYyMzFiNDI0NGI0ODk5ODJhMiIsImlhdCI6MTQ5MjI3NzAwNCwiZXhwIjoxNDkzMTQxMDA0fQ.wKMV7kYbfMbn44j71OOx8VAUShXHfMGcsiR7pvR4WYc';
  export default {
    data() {
      businessEditInfoValidation.confirmPassword[0].validator = businessEditInfoValidation.confirmPassword[0].validator.bind(this);
      return {
        form: new Form({
          email: '',
          password: '',
          confirmPassword: '',
          shortDescription: '',
          name: '',
          phoneNumbers: [],
        }),
        rules: businessEditInfoValidation,
        phoneNumbers: [],
        business: {},
        success: false,
        error: false,
        message: '',
        loading: false,
      };
    },
    methods: {
      getBusiness() {
        axios.get(Business().getBasicInfo, {
            headers: {
              Authorization: `JWT ${dummy_token}`,
            },
          })
          .then((response) => {
            this.business = response.data.business;
            this.form.email = this.business.email;
            this.form.password = '***************';
            this.form.confirmPassword = '***************';
            this.form.shortDescription = this.business.shortDescription;
            this.form.name = this.business.name;
            this.phoneNumbers = this.business.phoneNumbers.map((number, index) => ({
              number,
              index,
            }));
          }).catch((err) => {
            this.error = true;
            this.message = err.response ? err.response.data.errors.join(' | ') : err.message;
          });
      },
      onSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            // POST Here
            this.form.phoneNumbers = this.phoneNumbers.map(el => el.number);
            this.form.password = this.form.password === '***************' ? '' : this.form.password;
            this.form.confirmPassword = this.form.confirmPassword === '***************' ? '' : this.form.confirmPassword;
            console.log(this.form.data());
            this.success = false;
            this.error = false;
            this.loading = true;
            this.form.post(Business().editBasicInfo(this.business._id), {
                headers: {
                  Authorization: `JWT ${dummy_token}`,
                },
              })
              .then((data) => {
                this.loading = false;
                this.success = true;
                this.message = data.message;
                this.getBusiness();
              }).catch((err) => {
                this.loading = false;
                this.success = false;
              });
          } else {
            // Error Here
            this.error = true;
            this.message = 'Please Input all required fields!'
          }
        });
      },
      onReset() {
        //Reset Fields to their ORIGINAL form
        this.form.keys.forEach(el => this.form[el] = this.business[el], this);
        this.form.password = '***************';
        this.phoneNumbers = this.business.phoneNumbers.map((number, index) => ({
          number,
          index,
        }));
      },
      addPhone() {
        this.phoneNumbers.push({
          number: '',
          index: this.phoneNumbers.length,
        });
      },
    },
    mounted() {
      this.getBusiness();
    },
  }
</script>

<style>
  .error+.error {
    margin-top: 10px;
  }
</style>