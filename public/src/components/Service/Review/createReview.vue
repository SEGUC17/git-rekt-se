<template>
    <div class="box">
        <el-alert type="success" class="error" show-icon v-if="success" :title="success"></el-alert>
        <el-alert type="error" class="error" show-icon v-for="error in errors" :key="error" :title="error">
        </el-alert>
        <h3 class="title is-4"> Leave a review... </h3>
        <hr>
        <el-form ref="postReview" :model="review" :rules="rules" label-position="top">
            <el-form-item label="Rating" prop="rating" required>
                <el-rate v-model.number="review.rating"></el-rate>
            </el-form-item>
            <el-form-item label="Review" prop="description">
                <el-input type="textarea" v-model="review.description"
                          placeholder="Enter your review here (Max 512 characters)"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="!loggedin" @click="createReview">Create</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>


<script>
  import Axios from 'axios';
  import {Service} from '../../../services/EndPoints';
  import {reviewRules} from '../../../services/validation';
  import ClientAuth from '../../../services/auth/clientAuth';

  export default {
    data() {
      return {
        review: {
          rating: 0,
          description: '',
        },
        rules: reviewRules,
        success: '',
        errors: [],
        loggedin: ClientAuth.user.authenticated,
      };
    },
    props: ['serviceID'],
    methods: {
      createReview() {
        this.errors = [];
        this.success = '';
        this.$refs.postReview.validate((valid) => {
          if (valid) {
            const loader = this.$loading({
              fullscreen: true,
            });
            Axios.post(Service().createReview(this.serviceID), this.review, {
              headers: {
                Authorization: ClientAuth.getJWTtoken(),
              },
            })
                .then((response) => {
                  loader.close();
                  this.$refs.postReview.resetFields();
                  this.$emit('created');
                })
                .catch((error) => {
                  loader.close();
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
