<template>
    <div class="business-login">
        <section class="bus-signin-top hero is-bold">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title extra-large white">
                        Business Sign In
                    </h1>
                    <p class="subtitle white">
                        Manage your bookings, services and engage with your clients.
                    </p>
                </div>
            </div>
        </section>

        <div class="bus-login-form columns">
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
                    </el-form-item>

                    <span class="help forgot-help">
                            <router-link to="/business/forgot" class="is-semi-dark">Forgot password?</router-link>
                    </span>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm('form')">Login</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

    </div>
</template>

<script>
  import businessAuth from '../../services/auth/businessAuth';
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
            businessAuth.login(this.form.data(), (responseErrors, response) => {
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
    .bus-signin-top {
        background: #41295a; /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #2F0743, #41295a); /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #2F0743, #41295a); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        margin-bottom: 2em;
    }

    .error {
        margin-top: 20px;
    }

    .error:first-child {
        margin-top: 0;
    }

    @media screen and (max-width: 999px) {
        .bus-login-form {
            margin: 2em;
        }
    }
</style>
