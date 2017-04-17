<template>
  <el-alert type="success" show-icon v-if="success" :title="success">
  <el-alert type="error" show-icon v-for="error in errors" :title="error">
  </el-alert>
  <h3>
    Leave a review...</h3>
  <el-form ref="postReview" :model="review" :rules="rules" label-width="120px">
    <el-form-item label: "Rating" prop="rating">
      <el-rate v-model="review.rating"></el-rate>
    </el-form-item>
    <el-form-item label: "Review">
      <el-input type="textArea" v-model="review.description"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="createReview">Create</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import Axios from 'axios';
  import { Service } from '../../../../services/EndPoints';
  import { ReviewRules } from '../../../../services/validation';
  
  export default {
    data() {
      return {
        review: {
          rating: Number,
          description: Text,
        },
        rules: ReviewRules,
        success: '',
        errors: [],
      };
    },
    props: ['serviceID'],
    methods: {
      createReview() {
        this.errors = [];
        this.success = '';
        this.$refs.postReview.validate((valid) => {
          if (valid) {
            Axios.post(Service.createReview(this.serviceID), this.review)
              .then((response) => {
                this.$refs.postReview.resetFields();
                this.$emit('created');
              })
              .catch((error) => {
                this.errors = error.response.data.errors.map((err) => {
                  if (typeof err === 'string') {
                    return err;
                  }
                  return err.msg;
                });
              });
          }
        });
      },
    },
  };
</script>
