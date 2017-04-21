<template>
    <div class="confirm-email">
        <div class="email-confirmed">
            <div class="hero">
                <div class="container">
                    <div class="hero-body has-text-centered">
                        <el-icon name="circle-check" class="confirmation-icon" v-if="confirmed"></el-icon>
                        <el-icon name="circle-close" class="confirmation-icon icon-fail"
                                 v-if="errors.length > 0"></el-icon>

                        <h2 class="title is-2" v-if="confirmed">
                            Email confirmed!
                        </h2>

                        <div class="errors" v-if="errors.length > 0">
                            <h2 class="title is-3" v-for="error in errors" :key="error"> {{ error }} </h2>
                        </div>

                        <div class="columns" v-if="!resend && !confirmed">
                            <div class="column is-6 is-offset-3">
                                <div class="resend-email">
                                    <el-form :model="resendForm" :rules="emailRule" ref="resendForm">
                                        <el-form-item prop="email">
                                            <el-input placeholder="Email" v-model="resendForm.email"></el-input>
                                        </el-form-item>
                                    </el-form>
                                </div>
                                <el-button type="primary" size="large" @click="resendEmail('resendForm')">
                                    Resend email?
                                </el-button>
                            </div>
                        </div>

                        <resend :email="resendForm.email" send="true" v-if="resend"></resend>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import clientAuth from '../../services/auth/clientAuth';
  import commonAuth from '../../services/auth/commonAuth';
  import resend from '../Client/resend.vue';

  export default {
    components: {
      resend,
    },
    data() {
      return {
        confirmationSuccess: '',
        resendForm: {
          email: '',
        },
        confirmed: false,
        resend: false,
        errors: [],
        emailRule: {
          email: [{
            required: true,
            message: 'Email is required.',
            trigger: 'blur',
          }, {
            type: 'email',
            message: 'Invalid Email format.',
            trigger: 'blur',
          }],
        },
      };
    },
    mounted() {
      
      if(commonAuth.isAuthenticated()){
        this.$router.push('/');
        return;
      }
      
      const loader = this.$loading({
        fullscreen: true,
      });

      clientAuth.confirmEmail(this.$route.params.token, (responseErrs, response) => {
        loader.close();
        if (responseErrs) {
          this.errors = responseErrs.errors;
        } else {
          this.confirmationSuccess = response.message;
          this.confirmed = true;
          setTimeout(() => {
            this.$router.push('/client/login');
          }, 1000);
        }
      });
    },

    methods: {
      resendEmail(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.errors = [];
            this.resend = true;
          }
        });
      },
    },
  }
</script>

<style>
    .email-confirmed {
        border-radius: 0;
        padding: 2em;
    }

    .confirmation-icon {
        font-size: 10em;
        color: #42d885;
    }

    .icon-fail {
        color: #ff2b56;
    }
</style>

