<template>
  <div class="hero-body" style="padding : 200px">
    <div class="container">
      <div class="columns">
        <div class="column is-8 is-offset-2">
          <el-form :model="form" ref="form" label-width="120px" class="login-form">
            <el-form-item prop="email" label="Email" :rules="[
                    { required: true, message: 'Please input email address', trigger: 'blur' },
                    { type: 'email', message: 'Please input correct email address', trigger: 'blur,change' }
                  ]">
              <p class="control has-icon has-icon-right">
                <el-input v-model="form.email"></el-input>
                <span class="icon user">
                    <i class="fa fa-user"></i>
                  </span>
              </p>
            </el-form-item>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="form.submit('post','/api/v1/client/auth/forgot')" class="button is-info is-fullwidth">Forgot Password</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import Form from '../../../services/Form.js'
  export default {
    data() {
      return {
        form: new Form({
          email: '',
        })
      };
    }
  }
</script>

<style>
  .grey-background {
    background-color: grey;
  }
  
  html,
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    height: 100%;
    padding: 0;
    margin: 0;
  }
  
  .email-input,
  .password-input {
    border-radius: 40px;
    font-size: 20px;
    padding-left: 15px;
    color: #95A5A6;
  }
  
  .icon.user,
  .icon.password {
    margin: 5px 10px 0 0;
  }
  
  .avatar img {
    border-radius: 100px;
    padding: 5px;
    border: 1px solid #dbdbdb;
  }
  
  .forgot-password a {
    color: #95A5A6;
    font-weight: bold;
    padding-right: 20px;
  }
  
  .login {
    padding-top: 20px;
  }
  
  .login button {
    border-radius: 40px;
    font-weight: bold;
  }
  
  .hero-body .container {
    margin-top: -100px;
  }
  
  .hero.is-dark .section {
    background-color: transparent;
  }
  
  .login-wrapper {
    margin: -0.75rem;
    overflow-y: hidden;
  }
  
  .hero-banner .hero {
    background: url('https://unsplash.it/2000/1000');
    background-position: center;
    background-size: cover;
    background-blend-mode: screen;
  }
  
  .hero-banner .title {
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 5px;
  }
</style>