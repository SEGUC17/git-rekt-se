<template>
    <div class="client-login">
        <section class="client-signin-top hero is-bold">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title extra-large white">
                        Client Sign In
                    </h1>
                    <p class="subtitle white">
                        Book services, view your bookings and unlock achievements.
                    </p>
                </div>
            </div>
        </section>

        <div class="client-login-form columns">
            <div class="column is-half is-offset-one-quarter">

                <div v-show="errors.length > 0">
                    <div class="error" v-for="error in errors">
                        <el-alert :title="error" type="error" show-icon>
                        </el-alert>
                    </div>
                </div>

                <div v-show="logged_in">
                    <el-alert :title="loginSuccess" type="success" show-icon>
                    </el-alert>
                </div>


                <el-form :model="form" ref="form" :rules="rules" label-width="100px" label-position="top"
                         class="demo-ruleForm">
                    <el-form-item label="Email" prop="email">
                        <el-input v-model="form.email" placeholder="Email"></el-input>
                    </el-form-item>

                    <el-form-item label="Password" prop="password">
                        <el-input v-model="form.password" placeholder="Password" type="password"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm('form')">Login</el-button>
                        <el-button @click="resetForm('form')">Reset</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
  import clientAuth from '../../services/clientAuth';
  import Form from '../../services/Form';
  import {
    clientLoginRules,
  } from '../../services/validation';

  export default {
    data() {
      return {
        form: new Form({
          email: '',
          password: '',
        }),
        rules: clientLoginRules,
        logged_in: false,
        loginSuccess: '',
        errors: [],
      };
    },
    mounted() {
      clientAuth.refreshAuth();
      if (clientAuth.user.authenticated) {
        this.$router.push('/');
      }
    },
    methods: {
      submitForm(formName) {
        this.errors = [];
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loader = this.$loading({
              fullscreen: true,
            });
            clientAuth.login(this.form.data(), (responseErrors, response) => {
              loader.close();
              if (responseErrors) {
                this.errors = responseErrors.errors.map((err) => {
                  if (typeof err === 'string') {
                    return err;
                  }
                  return err.msg;
                });
              } else {
                this.logged_in = true;
                this.loginSuccess = response.message;
                setTimeout(() => {
                  this.$router.push('/');
                }, 1000);
              }
            });
          } else {
            this.errors.push('Please fill in all the fields');
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.errors = [];
      },
    },
  };
</script>

<style>
    .error {
        margin-top: 20px;
    }

    .error:first-child {
        margin-top: 0;
    }

    .demo-ruleForm {
        margin-top: 30px;
    }

    .client-signin-top {
        background: #67B26F; /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #4ca2cd, #67B26F); /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #4ca2cd, #67B26F); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        margin-bottom: 2em;
    }

    @media screen and (max-width: 999px) {
        .client-login-form {
            margin: 2em;
        }
    }
</style>
