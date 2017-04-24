<template>
  <el-dialog title="Edit Review" v-model="visible" @close="cancel">
    <el-alert type="error" show-icon v-for="error in errors" :key="error" :title="error"></el-alert>
    <el-form ref="editReview" :model="review" :rules="rules" label-width="120px">
      <el-form-item label="Rating" prop="rating" required>
        <el-rate v-model.number="review.rating"></el-rate>
      </el-form-item>
      <el-form-item label="Review" prop="description">
        <el-input type="textarea" v-model="review.description"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">Cancel</el-button>
      <el-button type="primary" @click="editReview">Edit</el-button>
    </span>
  </el-dialog>
</template>

<script>
 /**
  * This component allows the user to edit a review.
  */
  import Axios from 'axios';
  import { Service } from '../../../services/EndPoints';
  import { reviewRules } from '../../../services/validation';
  import ClientAuth from '../../../services/auth/clientAuth';
  
  export default {
    /**
     * Data used by this component.
     * rules: Validation rules to validate the user's input.
     * errors: Errors received from the server.
     */
    data() {
      return {
        rules: reviewRules,
        errors: [],
      };
    },
    /**
     * Props used by this component.
     * serviceID: The ID of the corresponding Service.
     * reviewID: The ID of the review to edit.
     * review: The Review content to edit with.
     * visible: true if dialog is visible, false otherwise.
     */
    props: ['serviceID', 'reviewID', 'review', 'visible'],
    /**
     * All Methods used by the component.
     */
    methods: {
      /**
       * Edit's a review.
       */
      editReview() {
        this.errors = [];
        this.$refs.editReview.validate((valid) => {
          if (valid) {
            const loader = this.$loading({
              fullscreen: true,
            });
            Axios.post(Service().editReview(this.serviceID, this.review._id), {
              rating: this.review.rating,
              description: this.review.description,
            }, {
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
      /**
       * Cancel, doesn't edit a review.
       */
      cancel() {
        this.$emit('cancelEdit');
      },
    },
  };
</script>
