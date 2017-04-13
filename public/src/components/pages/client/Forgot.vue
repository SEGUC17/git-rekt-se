<template>
  <div class="columns is-mobile grey-background" style="padding : 300px">
    <div class="column is-half is-offset-one-quarter">
      <div class="box">
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="120px" class="demo-dynamic">
          <el-form-item prop="email" label="Email" :rules="[
                  { required: true, message: 'Please input email address', trigger: 'blur' },
                  { type: 'email', message: 'Please input correct email address', trigger: 'blur,change' }
                ]">
            <el-input v-model="dynamicValidateForm.email"></el-input>
          </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('dynamicValidateForm')" class="button is-info is-fullwidth">Forgot Password</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    data() {
      return {
        dynamicValidateForm: {
          email: ''
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
  
            axios.post('/api/v1/client/auth/forgot', this.$data.dynamicValidateForm).then(alert('done'));
  
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    }
  }
</script>

<style >
  .grey-background {
    background-color : grey;
  }
</style>