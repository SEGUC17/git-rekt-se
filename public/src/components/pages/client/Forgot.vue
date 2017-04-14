<template>
  <div class="columns is-mobile grey-background" style="padding : 200px">
    <div class="column is-half is-offset-one-quarter">
      <div class="box">
        <el-form :model="form" ref="form" label-width="120px" class="demo-dynamic">
          <el-form-item prop="email" label="Email" :rules="[
                  { required: true, message: 'Please input email address', trigger: 'blur' },
                  { type: 'email', message: 'Please input correct email address', trigger: 'blur,change' }
                ]">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="form.submit('post','/api/v1/client/auth/forgot')" class="button is-info is-fullwidth">Forgot Password</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import Form from '../../../services/Form.js'
  export default {
    data() {
      return {
        form: new Form({
          email: '',
        })
      };
    }
  }
</script>

<style >
  .grey-background {
    background-color : grey;
  }
</style>