<template>
  <div class="client-reset-password">
    <section class="client-forgot-top hero is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title extra-large white">
            Forgot Password
          </h1>
        </div>
      </div>
    </section>
  
    <div class="reset-password-form columns">
      <div class="column is-8 is-offset-2">
        <el-alert title="Check your email to login" v-show="form.success" type="success" show-icon>
        </el-alert>
        <div class="login-form">
          <el-form :model="form" ref="form" :rules="rules">
            <el-form-item prop="email" label="Email"><i class="el-icon-message"></i>
              <el-input v-model="form.email" type="email">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('form')">Forgot Password</el-button>
            </el-form-item>
  
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import Form from '../../services/Form.js';
  import {Client} from '../../services/EndPoints.js';
  import {
    clientForgotPasswordMail
  } from '../../services/validation.js';
  
  export default {
    data() {
      return {
        form: new Form({
          email: '',
          success: false,
        }),
        rules: clientForgotPasswordMail,
        error: {},
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.post(Client().forgot)
                .then(() => {
                  this.form.success = true;
                })
               .catch(() => {
                  this.form.fail = true;
                });
          }
        });
      },
    },
  }
</script>

<style>
  .client-forgot-top {
    background: #159957;
    /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #155799, #159957);
    /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #155799, #159957);
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    margin-bottom: 2em;
  }
  
  @media screen and (max-width: 999px) {
    .reset-password-form {
      margin: 2em;
    }
  }
</style>
