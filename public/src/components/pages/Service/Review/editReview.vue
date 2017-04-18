<template>
<el-dialog title="Edit Review" v-model="dialogVisible">
  <el-alert type="error" show-icon v-for="error in errors" :title="error">
  <el-form ref="editReview" :model="review" :rules="rules" label-width="120px">
    <el-form-item label: "Rating" prop="rating">
      <el-rate v-model="review.rating"></el-rate>
    </el-form-item>
    <el-form-item label: "Review">
      <el-input type="textArea" v-model="review.description"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">Cancel</el-button>
      <el-button type="primary" @click="editReview">Edit</el-button>
     </span>
  </el-dialog>
</template>

<script>
  import Axios from 'axios';
  import { Service } from '../../../../services/EndPoints';
  import { ReviewRules } from '../../../../services/validation';
  import ClientAuth from '../../../../services/auth/clientAuth';
  
  export default {
    data() {
      return {
        dialogVisible: this.visible,
        reviewID: this.oldReview._id,
        review: {
          rating: this.oldReview.rating,
          description: this.oldReview.description,
        },
        rules: ReviewRules,
        errors: [],
      };
    },
    props: ['serviceID', 'oldReview', 'visible'],
    methods: {
      editReview() {
        this.errors = [];
        this.$refs.editReview.validate((valid) => {
          if (valid) {
            const loader = this.$loading({
              fullscreen: true,
            });
            Axios.post(Service.editReview(this.serviceID, this.reviewID), this.review, {
              headers: {
                Authorization: ClientAuth.getJWTtoken(),
              },
            })
              .then((response) => {
                loader.close();
                this.$emit('edited', response.message);
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
      cancel() {
        this.$emit('cancelEdit');
      },
    },
  };
</script>
