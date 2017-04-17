<template>
    <div class="columns is-mobile">
        <div class="column is-half is-offset-one-quarter">

            <h1 class="title has-text-centered">Login</h1>

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
</template>

<script>
  import businessAuth from '../../services/auth/businessAuth';
  import clientAuth from '../../services/auth/clientAuth';
  import Form from '../../services/Form';
  import { loginRules } from '../../services/validation';

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
      businessAuth.refreshAuth();
      clientAuth.refreshAuth();
      const authenticated = businessAuth.user.authenticated || clientAuth.user.authenticated;

      if (authenticated) {
        this.$router.push('/');
      }
    },
    methods: {
      submitForm(formName) {
        this.errors = [];
        this.$refs[formName].validate((valid) => {
          if (valid) {
            businessAuth.login(this.form.data(), (responseErrors, response) => {
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
</style>
