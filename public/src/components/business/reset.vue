<template>
    <div class="bus-reset-password">
        <gr-top-hero class="bus-signin-top" title="Reset Password"></gr-top-hero>
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
                <div class="errors" v-if="alert_show">
                    <el-alert @close="alert_show = false" :title="message"
                              class="error" type="success"
                              show-icon></el-alert>
                </div>

                <el-form :model="form" :rules="rules" ref="form" label-position="top">
                    <el-form-item label="Password" prop="password">
                        <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="Confirm Password" prop="confirmPassword">
                        <el-input type="password" v-model="form.confirmPassword" auto-complete="off"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" :loading="loading" @click="submitForm('form')">Submit</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
  import Form from '../../services/Form';
  import { Business } from '../../services/EndPoints';
  import { BusinessResetFormValidation } from '../../services/validation';

  export default {
    data() {
      BusinessResetFormValidation.confirmPassword[1]
          .validator = BusinessResetFormValidation.confirmPassword[1].validator.bind(this);
      BusinessResetFormValidation.password[2]
          .validator = BusinessResetFormValidation.password[2].validator.bind(this);
      return {
        form: new Form({
          password: '',
          confirmPassword: '',
          token: this.$route.params.token,
        }),
        rules: BusinessResetFormValidation,
        message: '',
        loading: false,
        errors: [],
        alert_show: false,
        error_show: false,
        btn_disable: true,
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.post(Business().reset)
                .then((data) => {
                  this.message = data.message;
                  this.alert_show = true;
                  this.error_show = false;
                })
                .catch((e) => {
                  this.alert_show = false;
                  this.error_show = false;
                  this.errors = e;
                });
          }
        });
      },
    },
  };
</script>
