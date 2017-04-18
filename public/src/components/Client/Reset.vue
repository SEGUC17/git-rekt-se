<template>
    <div class="client-reset-password">

        <!-- Client Reset password top header -->
        <section class="bus-signin-top hero is-bold">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title extra-large white">
                        Forgot Password
                    </h1>
                </div>
            </div>
        </section>

        <div class="reset-password-form columns">
            <div class="column content is-8 is-offset-2">
                <el-alert title="Password changed successfully" v-show="form.success" type="success" show-icon>
                </el-alert>

                <el-alert title="Token expired" v-show="form.fail" type="error" show-icon>
                </el-alert>

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
                            <el-button type="primary" @click="submitForm('form')">Submit</el-button>
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
        }),
        showPassword: 'password',
        showConfirm: 'password',
        errors: {},
        rules: clientForgotPassword,
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.post(Client().reset)
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
  };
</script>

<style>
    @media screen and (max-width: 999px) {
        .reset-password-form {
            margin: 2em;
        }
    }
</style>
