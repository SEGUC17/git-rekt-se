<template>

    <div class="business-edit-info box">

        <div class="errors" v-if="success">
            <el-alert @close="success = false" class="error" :title="message" type="success" show-icon></el-alert>
        </div>

        <div class="errors" v-if="!form.errors.isEmpty()">

            <div class="error" v-for="key in form.keys" v-show="form.errors.has(key)">
                <el-alert @close="form.errors.remove(key)" type="error"
                          :title="form.errors.getAll(key, ' | ')" show-icon></el-alert>
            </div>

            <div class="error" v-show="form.errors.has('serverError')">
                <el-alert @close="" :title="form.errors.getAll('serverError')"
                          type="error" show-icon></el-alert>
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
                <el-input v-model="form.password" :type="showPassword">
                    <template slot="append">
                        <el-tooltip content="See Password" placement="right">
                            <el-button @mousedown.native="showPassword='text'"
                                       @mouseup.native="showPassword='password'">
                                <i class="fa fa-eye"></i>
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-input>
            </el-form-item>

            <el-form-item label="Confirm Password" prop="confirmPassword">
                <el-input v-model="form.confirmPassword" :type="showConfirm">
                    <template slot="append">
                        <el-tooltip content="See Confirm Password" placement="right">
                            <el-button @mousedown.native="showConfirm='text'"
                                       @mouseup.native="showConfirm='password'">
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
  import axios from 'axios';
  import Form from '../../services/Form';
  import businessAuth from '../../services/auth/businessAuth';
  import commonAuth from '../../services/auth/commonAuth';
  import { Business } from '../../services/EndPoints';
  import { businessEditInfoValidation } from '../../services/validation';

  const dummyPassword = '***************';
  export default {
    data() {
      businessEditInfoValidation.confirmPassword[0]
          .validator = businessEditInfoValidation.confirmPassword[0]
          .validator.bind(this);
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
        showPassword: 'password',
        showConfirm: 'password',
      };
    },
    methods: {
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
      onSubmit() {
        this.success = false;
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
                  this.getBusiness()
                      .then(() => {
                        this.loading = false;
                      })
                      .catch(() => {
                        this.loading = false;
                      });
                }).catch(() => {
                  this.loading = false;
                  this.success = false;
                  this.onReset();
                });
          }
        });
      },
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
      },
      addPhone() {
        this.phoneNumbers.push({
          number: '',
          index: this.phoneNumbers.length,
        });
      },
    },
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
          .catch(() => loader.close());
    },
  };
</script>
