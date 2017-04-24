<template>
  <el-dialog title="Delete Review" v-model="visible" @close="cancel">
    <el-alert type="error" show-icon v-for="error in errors" :key="error" :title="error"></el-alert>
      <span>This cannot be undone. Delete this review?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">Cancel</el-button>
        <el-button type="primary" @click="deleteReview">Delete</el-button>
       </span>
  </el-dialog>
</template>

<script>
 /**
  * This component allows the user to delete a review.
  */
  import Axios from 'axios';
  import { Service } from '../../../services/EndPoints';
  import ClientAuth from '../../../services/auth/clientAuth';

  export default {
     /**
     * Data used by this component.
     * errors: Errors received from the server.
     */
    data() {
      return {
        errors: [],
      };
    },
    /**
     * Props used by this component.
     * serviceID: The ID of the corresponding Service.
     * reviewID: The ID of the review to delete.
     * visible: true if the dialog is visible, false otherwise.
     */
    props: ['serviceID', 'reviewID', 'visible'],
    /**
     * All Methods used by the component.
     */
    methods: {
      /**
       * Delete the review.
       */
      deleteReview() {
        this.errors = [];
        const loader = this.$loading({
          fullscreen: true,
        });
        Axios.post(Service().deleteReview(this.serviceID, this.reviewID), null, {
          headers: {
            Authorization: ClientAuth.getJWTtoken(),
          },
        })
        .then((response) => {
          loader.close();
          this.$emit('deleted', response.message);
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
      },
      /**
       * Cancel, doesn't delete the review.
       */
      cancel() {
        this.$emit('cancelDelete');
      },
    },
  };
</script>
