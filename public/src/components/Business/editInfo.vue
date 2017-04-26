<template>
  <div class="business-edit-info box">
  
    <div class="errors" v-if="success">
      <el-alert @close="success = false" class="error" :title="message" type="success" show-icon></el-alert>
    </div>
  
    <div class="errors" v-if="!form.errors.isEmpty()">
  
      <div class="error" v-for="key in form.keys" v-show="form.errors.has(key)">
        <el-alert @close="form.errors.remove(key)" type="error" :title="form.errors.getAll(key, ' | ')" show-icon></el-alert>
      </div>
  
      <div class="error" v-show="form.errors.has('serverError')">
        <el-alert @close="" :title="form.errors.getAll('serverError')" type="error" show-icon></el-alert>
      </div>
    </div>
  
    <el-form class="edit-info-form" ref="form" :model="form" :rules="rules" label-position="top">
      <el-form-item label="Name" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
  
      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
  
      <el-form-item label="Password" prop="password">
        <el-input v-model="form.password" :type="showPassword? 'text':'password'">
          <template slot="append">
                              <el-tooltip content="See Password" placement="right">
                                  <el-button @click="showPassword = !showPassword">
                                      <i class="fa fa-eye"></i>
                                  </el-button>
                              </el-tooltip>
</template>
                </el-input>
            </el-form-item>

            <el-form-item label="Confirm Password" prop="confirmPassword">
                <el-input v-model="form.confirmPassword" :type="showConfirm? 'text':'password'">
<template slot="append">
  <el-tooltip content="See Confirm Password" placement="right">
    <el-button @click="showConfirm = !showConfirm">
      <i class="fa fa-eye"></i>
    </el-button>
  </el-tooltip>
</template>
                </el-input>
            </el-form-item>

            <el-form-item v-for="el in phoneNumbers" :key="el.index" :label="`Phone Number ${el.index}`">
                <el-input v-model="el.number"></el-input>
            </el-form-item>

            <el-form-item label="Short Description" prop="shortDescription">
                <el-input v-model="form.shortDescription" type="textarea"
                          :autosize="{ minRows: 3, maxRows: 5}"></el-input>
            </el-form-item>

            <el-form-item class="has-text-centered">
                <el-button type="primary" icon="edit" @click="onSubmit" :loading="loading">Edit</el-button>
                <el-button icon="plus" @click="addPhone">Add Phone</el-button>
                <el-button icon="circle-cross" @click="onReset">Reset</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
  /**
   * This component is responsible for Editing the Business Info.
   */
  import axios from 'axios';
  import Form from '../../services/Form';
  import businessAuth from '../../services/auth/businessAuth';
  import commonAuth from '../../services/auth/commonAuth';
  import { Business } from '../../services/EndPoints';
  import { businessEditInfoValidation } from '../../services/validation';
  import JWTCheck from '../../services/JWTErrors';
  import EventBus from '../../services/EventBus';
  
  const dummyPassword = '***************';
  
  export default {
    data() {
      businessEditInfoValidation.password[0]
        .validator = businessEditInfoValidation.password[0]
        .validator.bind(this);
      businessEditInfoValidation.confirmPassword[0]
        .validator = businessEditInfoValidation.confirmPassword[0]
        .validator.bind(this);
  
      /**
       * Data used by this component.
       * form: Holds data entered by user and sent to server.
       * rules: Validation rules used to validate input.
       * phoneNumbers: Business' Phone Numbers.
       * business: Holds Business Info.
       * success: true if an operation completed successfully, false otherwise.
       * error: true if an error occured, false otherwise.
       * info: true if an info is displayed to user, false otherwise.
       * message: Message to display to the user.
       * loading: false if no loading true otherwise.
       * showPassword: text to show password, password to not show it.
       * showConfirm: text to show password, password to not show it.
       */
      return {
        form: new Form({
          email: '',
          password: '',
          confirmPassword: '',
          shortDescription: '',
          name: '',
          phoneNumbers: [],
        }),
        rules: businessEditInfoValidation,
        phoneNumbers: [],
        business: {},
        success: false,
        error: false,
        info: false,
        message: '',
        loading: false,
        showPassword: false,
        showConfirm: false,
        passwordChanged: false,
        emailChanged: false,
      };
    },
    /**
     * All Methods used by the component.
     */
    methods: {
      /**
       * Get Business Info.
       */
      getBusiness() {
        return new Promise((resolve, reject) => {
          axios.get(Business().getBasicInfo, {
            headers: {
              Authorization: businessAuth.getJWTtoken(),
            },
          })
            .then((response) => {
              this.business = response.data.business;
              this.onReset();
              resolve();
            }).catch((err) => {
              this.message = err.response ? err.response.data.errors.join(' | ') : err.message;
              reject(err);
            });
        });
      },
      /**
       * Validate and submit the data to edit info.
       */
      onSubmit() {
        this.success = false;
        if (this.form.password && this.form.confirmPassword) {
          this.passwordChanged = true;
        }
        if (this.form.email !== businessAuth.user.userEmail()) {
          this.emailChanged = true;
        }
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.form.phoneNumbers = this.phoneNumbers
              .filter(el => el.number.length > 0).map(el => el.number);
            this.form.password = this.form.password === dummyPassword ? '' : this.form.password;
            this.form.confirmPassword = this.form.confirmPassword === dummyPassword ? '' : this.form.confirmPassword;
            this.loading = true;
            this.form.post(Business().editBasicInfo(businessAuth.user.userID()), {
              headers: {
                Authorization: businessAuth.getJWTtoken(),
              },
            })
              .then((data) => {
                this.success = true;
                this.message = data.message;
                if (this.passwordChanged || this.emailChanged) {
                  this.loading = true;
                  businessAuth.logout((responseErrs, response) => {
                    let message;
                    EventBus.$emit('UpdateNavigation');
                    this.loading = false;
                    if (responseErrs) {
                      message = responseErrs.errors[0];
                    } else {
                      message = this.emailChanged ? 'Please wait for confirmation mail to login into the system' : 'Please login again';
                    }
  
                    this.$toast.open({
                      message,
                      type: 'is-primary',
                      position: 'bottom',
                    });
  
                    this.$router.push({
                      path: '/',
                    });
                  });
                } else {
                  this.getBusiness()
                    .then(() => {
                      this.loading = false;
                    })
                    .catch((err) => {
                      this.loading = false;
                      if (err.response && JWTCheck(err.response.data.errors)) {
                        businessAuth.removeData();
                        this.$router.push('/');
                        this.$toast.open({
                          text: 'Your sessions has expired. Please login.',
                          position: 'bottom',
                          type: 'danger',
                        });
                      }
                    });
                }
              }).catch((err) => {
                this.loading = false;
                this.success = false;
                if (err.response && JWTCheck(err.response.data.errors)) {
                  businessAuth.removeData();
                  this.$router.push('/');
                  this.$toast.open({
                    text: 'Your sessions has expired. Please login.',
                    position: 'bottom',
                    type: 'danger',
                  });
                } else {
                  this.onReset();
                }
              });
          }
        });
      },
      /**
       * Reset form fields.
       */
      onReset() {
        this.form.keys.forEach((el) => {
          this.form[el] = this.business[el];
        });
        this.form.password = dummyPassword;
        this.form.confirmPassword = dummyPassword;
        this.phoneNumbers = this.business.phoneNumbers.map((number, index) => ({
          number,
          index,
        }));
        this.showPassword = false;
        this.showConfirm = false;
      },
      /**
       * Add a new phone number field.
       */
      addPhone() {
        this.phoneNumbers.push({
          number: '',
          index: this.phoneNumbers.length,
        });
      },
    },
    /**
     * Ran when component is mounted.
     * Route user back if he/she is not authenticated, otherwise
     * get business Info.
     */
    mounted() {
      if (!commonAuth.isBusiness()) {
        this.$router.push('/404');
        return;
      }
      const loader = this.$loading({
        fullscreen: true,
      });
      this.getBusiness()
          .then(() => {
            loader.close();
          })
          .catch((err) => {
            loader.close();
            if (err.response && JWTCheck(err.response.data.errors)) {
              businessAuth.removeData();
              this.$router.push('/');
              this.$toast.open({
                text: 'Your sessions has expired. Please login.',
                position: 'bottom',
                type: 'danger',
              });
            }
          });
    },
  };
</script>
