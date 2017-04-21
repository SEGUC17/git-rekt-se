<template>
    <div class="client-edit-info">

        <!-- Top Header -->
        <gr-top-hero class="edit-information-client-top" title="Edit Information"></gr-top-hero>

        <div class="columns is-mobile">
            <div class="column is-half-desktop is-10-mobile is-10-tablet
                               is-offset-1-mobile is-offset-1-tablet is-offset-one-quarter-desktop">

                <!-- Backend Form Errors and message(s) -->
                <div class="error" v-show="success">
                    <el-alert :title="successMessage" type="success" show-icon></el-alert>
                </div>

                <div class="errors" v-show="!form.errors.isEmpty()">
                    <el-alert v-for="key in form.keys" v-if="form.errors.has(key)"
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

                <!-- Edit Information Form -->

                <el-form ref="form" :model="form" :rules="rules" label-position="top">
                    <el-form-item label="First Name" prop="firstName" required>
                        <el-input v-model="form.firstName"></el-input>
                    </el-form-item>

                    <el-form-item label="Last Name" prop="lastName" required>
                        <el-input v-model="form.lastName"></el-input>
                    </el-form-item>

                    <el-form-item label="Email" prop="email" required>
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>

                    <el-form-item label="Password" required>
                        <el-input v-model="form.password" :type="showPassword" prop="password"
                                  placeholder="***************">
                            <div slot="append">
                                    <el-button @click="onShowPassword"><i class="fa fa-eye"></i></el-button>
                            </div>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="Confirm Password" required>
                        <el-input v-model="form.confirmPassword" :type="showConfirm" prop="confirmPassword"
                                  placeholder="***************">
                            <div slot="append">
                                    <el-button @click="onShowConfirmPassword"><i class="fa fa-eye"></i></el-button>
                            </div>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="Mobile" prop="mobile" required>
                        <el-input v-model="form.mobile"></el-input>
                    </el-form-item>

                    <el-form-item label="Gender" prop="gender" required>
                        <el-radio-group v-model="form.gender">
                            <el-radio label="Male"></el-radio>
                            <el-radio label="Female"></el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="Birthdate" required>
                        <el-date-picker v-model="form.birthdate" type="date" :format="'dd-MM-yyyy'"></el-date-picker>
                    </el-form-item>

                    <el-form-item class="has-text-centered">
                        <el-button type="primary" :loading="loading" icon="circle-check" @click="submitForm('form')">
                            Edit

                        </el-button>
                    </el-form-item>
                </el-form>


            </div>
        </div>
    </div>
</template>

<script>
  import axios from 'axios';
  import Form from '../../services/Form';
  import Errors from '../../services/Errors';
  import { Client } from '../../services/EndPoints';
  import clientAuth from '../../services/auth/clientAuth';
  import { clientEditInfoValidation } from '../../services/validation';
  import JWTCheck from '../../services/JWTErrors';

  export default {
    data() {
      return {
        form: new Form({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          gender: '',
          mobile: '',
          birthdate: '',
        }),
        rules: clientEditInfoValidation,
        client: {},
        loading: false,
        showPassword: 'password',
        showConfirm: 'password',
        success: false,
        error: false,
        successMessage: '',
      };
    },
    mounted() {
      if (!clientAuth.isAuthenticated()) {
        this.$toast.open({
          message: 'You must be logged in to access this page.',
          type: 'is-danger',
          position: 'bottom',
        });
        this.$router.push('/');
        return;
      }
      this.fillForm();
    },
    methods: {
      fillForm() {
        const loader = this.$loading({
          fullscreen: true,
        });
        this.getClient()
            .then(() => {
              loader.close();
              this.form.email = this.client.email;
              this.form.confirmPassword = this.client.confirmPassword;
              this.form.firstName = this.client.firstName;
              this.form.lastName = this.client.lastName;
              this.form.gender = this.client.gender;
              this.form.mobile = this.client.mobile;
              this.form.birthdate = this.client.birthdate;
            })
            .catch((err) => {
              loader.close();
              if (JWTCheck(err)){
                clientAuth.removeData();
                this.$router.push('/');
                this.$toast.open({
                  message: 'Session Expired, please login',
                  type: 'is-danger',
                  position: 'bottom',
                });
              } else {
                this.error = true;
                this.message = err.response ? err.response.data.errors.join(' | ') : err.message;
              }
            });
      },
      onShowPassword() {
        if (this.showPassword === 'text') {
          this.showPassword = 'password';
        } else {
          this.showPassword = 'text';
        }
      },
      onShowConfirmPassword() {
        if (this.showConfirm === 'text') {
          this.showConfirm = 'password';
        } else {
          this.showConfirm = 'text';
        }
      },
      getClient() {
        return new Promise((resolve, reject) => {
          axios.get(Client().getInfo(clientAuth.user.userID()), {
            headers: {
              Authorization: clientAuth.getJWTtoken(),
            },
          })
              .then((response) => {
                this.client = response.data;
                resolve();
              }).catch((err) => {
                if (JWTCheck(err)) {
                  clientAuth.removeData();
                  this.$router.push('/');
                  this.$toast.open({
                    message: 'Session Expired, please login',
                    type: 'is-danger',
                    position: 'bottom',
                  });
                } else {
                  this.error = true;
                  this.message = err.response ? err.response.data.errors.join(' | ') : err.message;
                  reject(err);
                }
          });
        });
      },
      submitForm(formName) {
        this.success = false;
        this.successMessage = '';
        this.form.errors = new Errors();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            this.form.post(Client().editInfo(clientAuth.user.userID()), {
              headers: {
                Authorization: clientAuth.getJWTtoken(),
              },
            })
                .then((data) => {
                  this.loading = false;
                  this.success = true;
                  this.successMessage = data.message;
                  this.fillForm();
                }).catch((err) => {
                  this.loading = false;
                  if(JWTCheck(err)) {
                    clientAuth.removeData();
                    this.$router.push('/');
                    this.$toast.open({
                      message: 'Session Expired, please login',
                      type: 'is-danger',
                      position: 'bottom',
                    });
                  } else {
                      this.error = true;
                      this.message = err.response ? err.response.data.errors.join(' | ') : err.message;
                  }
            });
          }
        });
      },
      hasErrors() {
        const errors = this.$refs.form.$children.filter(el => el.validateMessage.length > 0);
        return errors.length > 0;
      },
    },
  };
</script>

<style>
    .edit-information-client-top {
        background: #141E30; /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #243B55, #141E30); /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #243B55, #141E30); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }
</style>
