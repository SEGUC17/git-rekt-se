<template>
<el-dialog title="Edit Review" v-model="dialogVisible">
  <el-alert title="Success" type="success" :description="successMessage" show-icon>
  </el-alert>
  <el-alert title="Error" type="error" show-icon v-for="error in errors" :description="error"></el-alert>
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
        sucess: false,
        successMessage: '',
        errors: [],
      };
    },
    props: ['serviceID', 'oldReview', 'visible'],
    methods: {
      editReview() {
        this.success = false;
        this.errors = [];
        this.$refs.editReview.validate((valid) => {
          if (valid) {
            Axios.post(Service.editReview(this.serviceID, this.reviewID), this.review)
              .then((response) => {
                this.success = true;
                this.successMessage = response.message;
                this.$emit('edited');
              })
              .catch((err) => {
                this.errors = err.response.data.errors;
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
