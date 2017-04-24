<template>
  <div class="bus-reset-password">
    <gr-top-hero class="bus-signin-top" title="Reset Password"></gr-top-hero>
    <div class="columns is-mobile">
      <div class="column is-half-desktop is-10-mobile is-10-tablet
                                 is-offset-1-mobile is-offset-1-tablet is-offset-one-quarter-desktop">
  
        <!-- Error Messages-->
        <div class="errors" v-if="errors.length > 0">
          <el-alert v-for="error in errors" class="error" :title="error" type="error" :key="error" show-icon>
          </el-alert>
        </div>
  
        <!-- Success Message -->
        <div class="errors" v-if="alert_show">
          <el-alert @close="alert_show = false" :title="message" class="error" type="success" show-icon></el-alert>
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
  /**
   * This component allows a Business change his password
   * after he requests to change it.
   */
  import Form from '../../services/Form';
  import { Business } from '../../services/EndPoints';
  import { BusinessResetFormValidation } from '../../services/validation';
  import businessAuth from '../../services/auth/businessAuth';
  import JWTCheck from '../../services/JWTErrors';

  export default {
    /**
     * Data used by this component.
     * form: Holds the data entered by user and sent to server.
     * rules: Validation Rules used to validate the input.
     * message: Message to view to the client.
     * loading: true if a request is sent and is being processed by server,
     * otherwise false.
     * errors: Errors received from server.
     * alert_show: true to show alert, false otherwise.
     * error_show: true to show error, false otherwise.
     * btn_disable: true to disable button, false otherwise.
     */
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
    /**
     * Methods used by the component.
     */
    methods: {
      /**
       * Validates and Submits a form.
       */
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
                if (e.response && JWTCheck(e.response.data.errors)) {
                  businessAuth.removeData();
                  this.$router.push('/');
                  this.$toast.open({
                    text: 'Your sessions has expired. Please login.',
                    position: 'bottom',
                    type: 'danger',
                  });
                } else {
                  this.alert_show = false;
                  this.error_show = false;
                  this.errors = e;
                }
              });
          }
        });
      },
    },
  };
</script>
