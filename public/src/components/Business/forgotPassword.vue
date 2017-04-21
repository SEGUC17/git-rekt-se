<template>
    <div class="business-forgot-password">
        <section class="business-forgot-top hero is-bold">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title extra-large white">
                        Forgot Password
                    </h1>
                </div>
            </div>
        </section>

        <div class="columns is-mobile">
            <div class="column is-half-desktop is-10-mobile is-10-tablet
                               is-offset-1-mobile is-offset-1-tablet is-offset-one-quarter-desktop">

                <!-- Error Messages-->
                <div class="errors" v-if="errors.length > 0">
                    <el-alert v-for="error in errors" class="error" :title="error"
                              type="error" :key="error | appendRandom" show-icon>
                    </el-alert>
                </div>

                <!-- Success Message -->
                <div class="errors" v-if="successShow">
                    <el-alert @close="successShow = false" :title="message"
                              class="error" type="success"
                              show-icon></el-alert>
                </div>

                <div class="login-form">
                    <el-form :model="form" ref="form" :rules="rules">
                        <el-form-item prop="email" label="Email">
                            <el-input v-model="form.email" type="email" icon="message">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('form')" :loading="loading">
                                Forgot Password
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Form from '../../services/Form';
  import {
    Business
  } from '../../services/EndPoints';
  import {
    forgotPasswordValidation
  } from '../../services/validation';
  
  export default {
    data() {
      return {
        form: new Form({
          email: '',
        }),
        errors: '',
        rules: forgotPasswordValidation,
        message: '',
        successShow: false,
        errorShow: false,
        loading: false,
      };
    },
    methods: {
      submitForm(formName) {
        this.error_show = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            this.form.post(Business().forgot)
                .then((data) => {
                  this.message = data.message;
                  this.loading = false;
                  this.successShow = true;
                })
                .catch((err) => {
                  this.errorShow = true;
                  this.loading = false;
                  this.errors = err;
                });
          }
        });
      },
    },
  };
</script>

<style>
    .business-forgot-top {
        background: #41295a; /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #2F0743, #41295a); /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #2F0743, #41295a); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        margin-bottom: 2em;
    }
</style>
