<template>
  <div class="client-login" @submit.prevent="submitForm('form')">
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

    <div class="client-login-form columns is-mobile">
      <div class="column is-half-desktop is-10-mobile is-10-tablet
                               is-offset-1-mobile is-offset-1-tablet is-offset-one-quarter-desktop">

        <div class="centered-fb">
          <a @click.prevent="redirectFacebook">
            <img src="assets/imgs/fb-login.png" alt="Facebook Login" width="50%">
          </a>
        </div>

        <hr>

        <div v-show="info">
          <el-alert @close="info = false" :title="message" type="info" show-icon></el-alert>
        </div>

        <div class="errors" v-show="errors.length > 0">
          <el-alert v-for="error in errors" class="error" :title="error"
                    type="error" :key="error" show-icon>
          </el-alert>
        </div>

        <div v-show="logged_in">
          <el-alert @close="logged_in = false" :title="loginSuccess" type="success" show-icon>
          </el-alert>
        </div>

        <el-form :model="form" ref="form" :rules="rules" label-width="100px" label-position="top"
                 class="login-form" @keyup.enter.native="submitForm('form')">
          <el-form-item label="Email" prop="email">
            <el-input v-model="form.email" placeholder="Email" icon="message"></el-input>
          </el-form-item>

          <el-form-item label="Password" prop="password">
            <el-input v-model="form.password" placeholder="Password" :type="showPassword? 'text':'password'"
                      icon="edit">
            <div slot="append">
                    <el-button @click="showPassword = !showPassword"><i class="fa fa-eye"></i>
                    </el-button>
            </div>          
            </el-input>
          </el-form-item>
          <span class="help forgot-help">
                            <router-link to="/client/forgot"
                                         class="is-semi-dark">Forgot password?</router-link>
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
 /**
  * This component is responsible for client login.
  */
  import axios from 'axios';
  import clientAuth from '../../services/auth/clientAuth';
  import Authenticator from '../../services/auth/commonAuth';
  import Form from '../../services/Form';
  import { loginRules } from '../../services/validation';
  import { Client } from '../../services/EndPoints';
  import EventBus from '../../services/EventBus';

  export default {
    /**
     * Data used by the component.
     * form: Data entered by user and sent to the server.
     * rules: Validation rules used to validate user input.
     * info: true to display info to the user, false otherwise.
     * logged_in: true if login success, false otherwise.
     * loginSuccess: Message received from server when successfully logged in.
     * errors: Errors received from the server.
     */
    data() {
      return {
        form: new Form({
          email: '',
          password: '',
        }),
        rules: loginRules,
        info: false,
        logged_in: false,
        loginSuccess: '',
        message: '',
        errors: [],
        showPassword: false,
      };
    },
    /**
     * Methods used by the component.
     */
    methods: {
      /**
       * Redirect to login with facebook route.
       */
      redirectFacebook() {
        window.location.href = Client().facebookRedirect;
      },
      /**
       * Validate and submit form to login the client.
       */
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
                this.afterLoginHandler();
                this.loginSuccess = response.message;
              }
            });
          }
        });
      },
      /**
       * Route to `Home` when client is logged in.
       */
      afterLoginHandler() {
        this.logged_in = true;
        setTimeout(() => {
          this.$router.go({
            path: '/',
          });
          EventBus.$emit('UpdateNavigation');
        }, 1000);
      },
      /**
       * Handle facebook Login.
       */
      facebookLogin() {
        const query = this.$route.query;
        if (query && query.is_facebook === 'true') {
          const token = query.token;
          if (!token || token.length === 0) {
            return;
          }
          const loader = this.$loading({
            fullscreen: true,
            text: 'Signing in..',
          });
          axios.post(Client().finalizeFb, {
            token,
          })
              .then((response) => {
                loader.close();
                this.afterLoginHandler(response);
                this.loginSuccess = response.data.message;
                clientAuth.storeData(response);
              }).catch((err) => {
                this.errors = this.errors
                    .concat(err.response ? err.response.data.errors : [err.message]);
                loader.close();
              });
        }
      },
    },
    /**
     * Ran when component is mounted on DOM.
     * If user is authenticated route him back,
     * otherwise if an error exist in query display it,
     * otherwise attempt to login with facebook if possible.
     */
    mounted() {
      if (Authenticator.isAuthenticated()) {
        this.$router.push('/');
        return;
      }

      const query = this.$route.query;
      if (query.error) {
        this.info = true;
        this.message = query.error;
      }

      this.facebookLogin();
    },
  };
</script>

<style>
  .centered-fb img {
    display: block;
    width: 250px;
    margin: auto;
  }

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

  .is-semi-dark {
    color: #717171;
  }

  .forgot-help {
    margin-bottom: 1em;
  }

</style>
