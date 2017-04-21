<template>
    <div style="business-signup">

        <section class="business-signup-top hero is-bold">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title extra-large white">
                        Apply
                    </h1>
                    <p class="subtitle white">
                        Get your business the exposure it deserves.
                    </p>
                </div>
            </div>
        </section>

        <div class="container">
            <div class="business-signup-form columns is-mobile">
                <div class="column is-half-desktop is-10-mobile is-10-tablet is-offset-1-mobile
                                is-offset-1-tablet is-offset-one-quarter-desktop">
                    <div class="login-form">

                        <div class="errors" v-show="errors.length > 0">
                            <el-alert v-for="error in errors" class="error" :title="error"
                                      type="error" :key="error | appendRandom" show-icon></el-alert>
                        </div>

                        <div class="errors" v-show="success">
                            <el-alert :title="signupSuccess" type="success" class="error" show-icon></el-alert>
                        </div>

                        <el-form :model="form" :rules="rules2" ref="form">
                            <el-form-item label="Business name" prop="name">
                                <el-input v-model="form.name"></el-input>
                            </el-form-item>
                            <el-form-item label="Email" prop="email">
                                <el-input v-model="form.email"></el-input>
                            </el-form-item>
                            <el-form-item label="Short description" prop="shortDescription">
                                <el-input type="textarea" v-model="form.shortDescription"></el-input>
                            </el-form-item>
                            <el-form-item label="Mobile number" prop="mobile">
                                <el-input v-model="form.mobile"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('form')">Submit</el-button>
                                <el-button @click="resetForm('form')">Reset</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
  import Form from '../../services/Form';
  import {Business} from '../../services/EndPoints';
  import {
    unverfiedBusinessSignupValidation,
  } from '../../services/validation';

  export default {
    data() {
      return {
        form: new Form({
          name: '',
          email: '',
          shortDescription: '',
          mobile: '',
        }),
        rules2: unverfiedBusinessSignupValidation,
        errors: [],
        success: false,
        signupSuccess: '',
      };
    },
    methods: {
      submitForm(formName) {
        this.errors = [];
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loader = this.$loading({
              fullscreen: true,
            });
            this.form.post(Business().unverfiedSignUp).then((data) => {
              loader.close();
              this.success = true;
              this.signupSuccess = data.message;
              setTimeout(() => {
                this.$router.push('/');
              }, 1000);
            }).catch((e) => {
              loader.close();
              this.errors = e;
            });
          }
        });
      },

      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
  };
</script>

<style>
    .business-signup-top {
        background: #9D50BB; /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #6E48AA, #9D50BB); /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #6E48AA, #9D50BB); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }
</style>
