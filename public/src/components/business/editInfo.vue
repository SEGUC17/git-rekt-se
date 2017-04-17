<template>
  <div class="columns is-mobile">
    <div class="column is-half is-offset-one-quarter">
  
      <div v-show="success">
        <el-alert @close="success = false" title="Success" :description="message" type="success" show-icon></el-alert>
      </div>
      
      <div v-show="info">
        <el-alert @close="info = false" :title="message" type="info" show-icon></el-alert>
      </div>

      <div v-show="!form.errors.isEmpty() || error">
        <div v-show="error">
          <el-alert @close="error = false" title="Error" type="error" :description="message" show-icon></el-alert>
        </div>
  
        <div class="error" v-for="key in form.keys" v-show="form.errors.has(key)">
          <el-alert @close="form.errors.remove(key)" :title="key.toUpperCase()" type="error" :description="form.errors.getAll(key, ' | ')" show-icon></el-alert>
        </div>
  
        <div class="error" v-show="form.errors.has('serverError')">
          <el-alert @close="" title="Server Errors" :description="form.errors.getAll('serverError')" type="error" show-icon></el-alert>
        </div>
      </div>
  
      <h1 class="title has-text-centered">Edit Basic Information</h1>
  
      <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="120px">
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
                <el-button @mousedown.native="showPassword='text'" @mouseup.native="showPassword='password'">
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
                <el-button @mousedown.native="showConfirm='text'" @mouseup.native="showConfirm='password'">
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
          <el-input v-model="form.shortDescription" type="textarea" :autosize="{ minRows: 1, maxRows: 3}"></el-input>
        </el-form-item>

        <el-form-item class="has-text-centered">
          <el-button type="primary" icon="edit" @click="onSubmit" :loading="loading">Edit</el-button>
          <el-button icon="plus" @click="addPhone">Add Phone</el-button>
          <el-button icon="circle-cross" @click="onReset">Reset</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Form from '../../services/Form';
  import businessAuth from '../../services/auth/businessAuth';
  import { Business } from '../../services/EndPoints';
  import { businessEditInfoValidation } from '../../services/validation';
  const dummy_password = '***************';
  export default {
    data() {
      console.log(businessEditInfoValidation);
      businessEditInfoValidation.confirmPassword[0].validator = businessEditInfoValidation.confirmPassword[0].validator.bind(this);
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
                this.error = true;
                this.message = err.response ? err.response.data.errors.join(' | ') : err.message;
                reject(err);
              });
        });
      },
      onSubmit() {
        this.$refs.form.validate((valid) => {
          console.log(this.form.data());
          console.log(valid);
          if (valid) {
            this.form.phoneNumbers = this.phoneNumbers.filter(el => el.number.length > 0).map(el => el.number);
            this.form.password = this.form.password === dummy_password ? '' : this.form.password;
            this.form.confirmPassword = this.form.confirmPassword === dummy_password ? '' : this.form.confirmPassword;
            this.info = false;
            this.success = false;
            this.error = false;
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
                  .then(() => this.loading = false)
                  .catch(() => console.log('Error!'));
              }).catch((err) => {
                this.loading = false;
                this.success = false;
                this.onReset();
              });
          } else {
            this.error = true;
            this.message = 'Please Input all required fields!'
          }
        });
      },
      onReset() {
        //Reset Fields to their ORIGINAL form
        this.form.keys.forEach(el => this.form[el] = this.business[el], this);
        this.form.password = dummy_password;
        this.form.confirmPassword = dummy_password;
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
      const loader = this.$loading({
        fullscreen: true,
        text: 'Fetching Data',
      });
      this.getBusiness()
        .then(() => {
          loader.close();
          this.info = true;
          this.message = 'Edit the info you want to change, otherwise leave them as is !';
        })
        .catch(() => console.log('Error!'));
    },
  }
</script>

<style>
  .error+.error {
    margin-top: 10px;
  }
</style>