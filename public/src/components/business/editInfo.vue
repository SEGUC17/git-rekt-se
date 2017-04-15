<template>
  <div class="columns is-mobile">
    <div class="column is-half is-offset-one-quarter">
  
      <h1 class="title has-text-centered">Edit Basic Information</h1>
  
      <el-form ref="form" :model="form" label-position="left" label-width="120px">
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
  
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
  
        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
  
        <el-form-item label="Short Description" prop="shortDescription">
          <el-input v-model="form.shortDescription"></el-input>
        </el-form-item>
  
        <el-form-item label="Phone Numbers" prop="shortDescription">
          <el-input v-model="form.phoneNumbers"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Form from '../../services/Form';
  import {
    Business
  } from '../../services/EndPoints';
  export default {
    data() {
      return {
        form: new Form({
          email: '',
          password: '',
          shortDescription: '',
          name: '',
          phoneNumbers: '',
        }),
        success: false,
        successMessage: '',
      };
    },
    methods: {
  
    },
    mounted() {
      const dummy_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ZWQyZmYyMzFiNDI0NGI0ODk5ODJhMiIsImlhdCI6MTQ5MjI3NzAwNCwiZXhwIjoxNDkzMTQxMDA0fQ.wKMV7kYbfMbn44j71OOx8VAUShXHfMGcsiR7pvR4WYc';
      axios.get(Business().getBasicInfo, {
        headers: {
          Authorization: `JWT ${dummy_token}`,
        },
      })
        .then((response) => {
          console.log(response.data);
        }).catch(err => console.log(err.response.data));
    },
  }
</script>