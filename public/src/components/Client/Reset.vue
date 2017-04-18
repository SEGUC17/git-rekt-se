<template>
    <div class="client-reset-password">

        <!-- Client Reset password top header -->
        <section class="client-forgot-top hero is-bold">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title extra-large white">
                        Reset Password
                    </h1>
                </div>
            </div>
        </section>

        <div class="reset-password-form columns">
            <div class="column content is-8 is-offset-2">
               <div class="alerts">
                
                <el-alert class="alert-msg" :title="form.message" v-show="form.success" type="success" show-icon></el-alert>

                <!--<el-alert class="alert-msg" title="Token expired" v-show="form.fail" type="error" show-icon></el-alert>-->
                <div class="alert-msg error" v-for="key in form.keys" v-show="form.errors.has(key)">
                        <el-alert @close="form.errors.remove(key)" type="error"
                                  :title="form.errors.getAll(key, ' | ') || '' " show-icon></el-alert>
                </div>

                <div class="alert-msg error" v-show="form.errors.has('serverError')">
                        <el-alert @close="form.errors.remove('serverError')"
                                  :title="form.errors.getAll('serverError', ' | ') || ''" type="error"
                                  show-icon></el-alert>
                </div>

               </div>

                <div class="login-form">
                    <el-form :model="form" :rules="rules" ref="form">

                        <el-form-item label="Password" prop="password">
                            <el-input type="password" v-model="form.password"
                                      :type="showPassword" auto-complete="off">
                                <div slot="append">
                                    <el-button @mousedown.native="showPassword = 'text'"
                                               @mouseup.native="showPassword = 'password'"><i
                                            class="fa fa-eye"></i>
                                    </el-button>
                                </div>
                            </el-input>
                        </el-form-item>

                        <el-form-item label="Confirm Password" prop="confirmPassword">
                            <el-input type="password" v-model="form.confirmPassword"
                                      auto-complete="off" :type="showConfirm">
                                <div slot="append">
                                    <el-button @mousedown.native="showConfirm = 'text'"
                                               @mouseup.native="showConfirm = 'password'"><i
                                            class="fa fa-eye"></i>
                                    </el-button>
                                </div>
                            </el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" :loading="loading" @click="submitForm('form')">Submit</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
  import Form from '../../services/Form';
  import { Client } from '../../services/EndPoints';
  import { clientForgotPassword } from '../../services/validation';

  export default {
    data() {
      clientForgotPassword.confirmPassword[1].validator = clientForgotPassword.confirmPassword[1]
          .validator.bind(this);
      clientForgotPassword.password[2].validator = clientForgotPassword.password[2]
          .validator.bind(this);
      return {
        form: new Form({
          token: this.$route.params.token,
          password: '',
          confirmPassword: '',
          success: false,
          fail: false,
          message: '',
        }),
        showPassword: 'password',
        showConfirm: 'password',
        loading: false,
        errors: {},
        rules: clientForgotPassword,
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            this.form.post(Client().reset)
                .then((data) => {
                  this.form.success = true;
                  this.loading = false;
                  this.form.message = data.message;
                })
                .catch((e) => {
                  this.form.fail = true;
                  this.loading = false;
                  this.errors = e.map(() => {

                  });
                });
          }
        });
      },
    },
  };
</script>

<style>
    .alert-msg{
        margin-top: 1em;
    }

    .client-forgot-top{
        background: #159957;  /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #155799, #159957);  /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #155799, #159957); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        margin-bottom: 2em;
    }

    @media screen and (max-width: 999px) {
        .reset-password-form {
            margin: 2em;
        }
    }
</style>
