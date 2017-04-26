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
                <div class="error-alerts">
                    <el-alert :title="message" v-show="form.success" type="success" show-icon></el-alert>
                    <el-alert :title="error" v-show="form.fail" type="success" show-icon></el-alert>
                </div>
                <div class="login-form">
                    <el-form :model="form" ref="form" :rules="rules">
                        <el-form-item prop="email" label="Email">
                            <el-input v-model="form.email" type="email" icon="message">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('form')" :loading="loading">Forgot Password
                            </el-button>
                        </el-form-item>

                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
 /**
  * This component allows the client to request a password change
  * incase he forgot the old one.
  */
  import Form from '../../services/Form';
  import { Client } from '../../services/EndPoints';
  import { clientForgotPasswordMail } from '../../services/validation';

  export default {
   /**
    * Data used by the component.
    * form: Holds the data entered by the client and sent to the server.
    * rules: Validation rules used to validate user input.
    * loading: true if a request has been sent and is processed by the server.
    * false otherwise.
    * message: A Message recevied from the server.
    */
    data() {
      return {
        form: new Form({
          email: '',
          success: false,
          fail: false,
        }),
        rules: clientForgotPasswordMail,
        error: '',
        loading: false,
        message: '',
      };
    },
    /**
     * Methods used by the component.
     */
    methods: {
        /**
         * Validate and submit the form.
         */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            this.form.post(Client().forgot)
                .then((data) => {
                  this.loading = false;
                  this.form.success = true;
                  this.message = data.message;
                })
                .catch((e) => {
                  this.loading = false;
                  this.form.fail = true;
                  this.error = e[0];
                });
          }
        });
      },
    },
  };
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
