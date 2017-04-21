<template>
    <div class="client-signup">
        <!-- Client Signup Header -->
        <section class="client-signin-top hero is-bold">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title extra-large white">
                        Client Sign Up
                    </h1>
                    <p class="subtitle white">
                        Enhance your skills and choose from our handpicked partners.
                    </p>
                </div>
            </div>
        </section>

        <div class="columns is-mobile">
            <div v-if="!success" class="column is-half-desktop is-10-mobile is-10-tablet is-offset-1-mobile
                                is-offset-1-tablet is-offset-one-quarter-desktop">

                <div class="centered-fb">
                    <a @click.prevent="redirectFacebook">
                        <img src="assets/imgs/fb-login.png" alt="Facebook Login" width="50%">
                    </a>
                </div>

                <hr class="client-login-form">

                <!-- Info Incase signing up with facebook -->
                <div v-show="info" class="client-login-form">
                    <el-alert @close="info = false" :title="message" type="info" show-icon></el-alert>
                </div>

                <!-- Backend Form Errors-->
                <div class="errors" v-if="!form.errors.isEmpty()">
                    <el-alert v-for="key in form.keys" v-show="form.errors.has(key)"
                              @close="form.errors.remove(key)" class="error"
                              type="error" :key="error"
                              :title="form.errors.getAll(key, ' | ') || '' " show-icon>
                    </el-alert>

                    <el-alert v-if="form.errors.has('serverError')"
                              @close="form.errors.remove('serverError')"
                              class="error"
                              :title="form.errors.getAll('serverError', ' | ') || ''" type="error"
                              show-icon>
                    </el-alert>
                </div>

                <!-- Signup Form -->
                <el-form ref="form" class="signup-form" :model="form" :rules="rules" :label-position="'top'">
                    <el-form-item label="First Name" prop="firstName">
                        <el-input v-model="form.firstName" placeholder="John"></el-input>
                    </el-form-item>

                    <el-form-item label="Last Name" prop="lastName">
                        <el-input v-model="form.lastName" placeholder="Appleseed"></el-input>
                    </el-form-item>

                    <el-form-item label="Email" prop="email">
                        <el-input v-model="form.email" placeholder="example@domain.com"></el-input>
                    </el-form-item>

                    <el-form-item label="Password" prop="password">
                        <el-input v-model="form.password" :type="showPassword">
                            <div slot="append">
                                <el-button @mousedown.native="showPassword = 'text'"
                                           @mouseup.native="showPassword = 'password'"><i class="fa fa-eye"></i>
                                </el-button>
                            </div>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="Confirm Password" prop="confirmPassword">
                        <el-input v-model="form.confirmPassword" :type="showConfirm">
                            <div slot="append">
                                <el-button @mousedown.native="showConfirm = 'text'"
                                           @mouseup.native="showConfirm = 'password'"><i class="fa fa-eye"></i>
                                </el-button>
                            </div>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="Mobile" prop="mobile">
                        <el-input v-model="form.mobile" placeholder="01123456789"></el-input>
                    </el-form-item>

                    <el-form-item label="Gender" prop="gender">
                        <el-radio-group v-model="form.gender">
                            <el-radio label="Male"></el-radio>
                            <el-radio label="Female"></el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="Birth Date" prop="birthdate">
                        <el-date-picker v-model="form.birthdate" type="date" :format="'dd-MM-yyyy'"
                                        placeholder="1-1-1990"></el-date-picker>
                    </el-form-item>

                    <el-form-item class="has-text-centered">
                        <el-button type="primary" icon="circle-check" @click="onClick" :loading="loading">
                            Sign Up
                        </el-button>
                        <el-button icon="circle-cross" @click="onReset">Reset</el-button>
                    </el-form-item>
                </el-form>

            </div>
        </div>

        <resend class="column is-10 is-offset-1" :email="clientEmail" v-if="success"></resend>
    </div>
</template>

<script>
  import Form from '../../services/Form';
  import resend from './resend.vue';
  import commonAuth from '../../services/auth/commonAuth';

  import {Client} from '../../services/EndPoints';
  import {clientSignUpValidation} from '../../services/validation';

  export default {
    data() {
      clientSignUpValidation.confirmPassword[1].validator = clientSignUpValidation.confirmPassword[1]
          .validator.bind(this);
      clientSignUpValidation.password[2].validator = clientSignUpValidation.password[2]
          .validator.bind(this);
      clientSignUpValidation.birthdate[2].validator = clientSignUpValidation.birthdate[2]
          .validator.bind(this);
      return {
        form: new Form({
          id: '',
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          gender: '',
          mobile: '',
          birthdate: '',
        }),
        rules: clientSignUpValidation,
        showPassword: 'password',
        showConfirm: 'password',
        success: false,
        error: false,
        info: false,
        message: '',
        clientEmail: '',
        loading: false,
      };
    },
    methods: {
      redirectFacebook() {
        window.location.href = 'http://localhost:3000/api/v1/client/auth/fb/login';
      },
      onClick() {
        this.info = false;
        this.success = false;
        this.message = '';
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.clientEmail = this.form.email;
            this.loading = true;
            this.form.post(Client().signup)
                .then((data) => {
                  this.loading = false;
                  this.success = true;
                  this.message = data.message;
                  this.form = new Form(data);
                }).catch(() => {
              this.success = false;
              this.loading = false;
            });
          }
        });
      },
      onReset() {
        this.$refs.form.resetFields();
      },
      resendMail() {
        this.loading = true;
        this.success = false;
        this.message = '';
        this.form.email = this.clientEmail;
        this.form.post(Client().resend)
            .then((data) => {
              this.loading = false;
              this.success = true;
              this.message = data.message;
            }).catch(() => {
          this.loading = false;
          this.success = false;
        });
      },
    },
    mounted() {
      if (commonAuth.isAuthenticated()) {
        this.$router.push('/');
        this.$toast.open({
          message: 'You are already logged in',
          position: 'bottom',
          type: 'is-danger',
        });
      } else if (this.$route.query && this.$route.query.error) {
        this.message = this.$route.query.password || 'Failed to fetch information from facebook.';
      } else if (this.$route.query && this.$route.query.is_facebook === 'true') {
        const query = this.$route.query;
        Object.keys(query).forEach((key) => {
          if (key === 'first_name') {
            this.form.firstName = query[key];
          } else if (key === 'last_name') {
            this.form.lastName = query[key];
          } else if (key === 'birthday') {
            this.form.birthdate = query[key];
          } else if (key === 'gender') {
            this.form.gender = query[key] === 'male' ? 'Male' : 'Female';
          } else {
            this.form[key] = query[key];
          }
        }, this);
        this.info = true;
        this.message = 'These information where fetched from facebook, please fill the remaining fields.';
      }
    },
    components: {
      resend,
    },
  };
</script>

<style>

    @media screen and (max-width: 999px) {
        .extra-large {
            font-size: 2.5em;
        }
    }
</style>
