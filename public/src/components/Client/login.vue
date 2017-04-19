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
                          class="login-form">
                    <el-form-item label="Email" prop="email">
                        <el-input v-model="form.email" placeholder="Email"></el-input>
                    </el-form-item>

                    <el-form-item label="Password" prop="password">
                        <el-input v-model="form.password" placeholder="Password" type="password"></el-input>
                        <span class="is-help">
                            <router-link to="/client/forgot" class="is-semi-dark">Forgot password?</router-link>
                        </span>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm('form')">Login</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
  import clientAuth from '../../services/auth/clientAuth';
  import Authenticator from '../../services/auth/commonAuth';
  import Form from '../../services/Form';
  import { loginRules } from '../../services/validation';
  import EventBus from '../../services/EventBus';

  export default {
    data() {
      return {
        form: new Form({
          email: '',
          password: '',
        }),
        rules: loginRules,
        logged_in: false,
        loginSuccess: '',
        errors: [],
      };
    },
    mounted() {
      if (Authenticator.isAuthenticated()) {
        this.$router.push({
          path: '/',
        });
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
                  this.$router.push({
                    path: '/',
                  });
                  EventBus.$emit('UpdateNavigation');
                }, 1000);
              }
            });
          } else {
            this.errors.push('Please fill in all the fields.');
          }
        });
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

    .client-signin-top {
        background: #67B26F; /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #4ca2cd, #67B26F); /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #4ca2cd, #67B26F); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        margin-bottom: 2em;
    }

    .is-semi-dark{
        color: #717171;
    }
    @media screen and (max-width: 999px) {
        .client-login-form {
            margin: 2em;
        }
    }
</style>
