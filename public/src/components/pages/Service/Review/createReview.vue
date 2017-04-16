<template>
  <el-alert title="Error" type="error" show-icon v-for="error in errors" :description="error"></el-alert>
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
        errors: [],
      };
    },
    props: ['serviceID'],
    methods: {
      createReview() {
        this.errors = [];
        this.$refs.postReview.validate((valid) => {
          if (valid) {
            Axios.post(Service.createReview(this.serviceID), this.review)
              .then((response) => {
                this.$refs.postReview.resetFields();
                this.$emit('created', response.message);
              })
              .catch((err) => {
                this.errors = err.response.data.errors;
              });
          }
        });
      },
    },
  };
</script>
