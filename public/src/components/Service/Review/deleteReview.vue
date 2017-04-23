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
  import Axios from 'axios';
  import { Service } from '../../../services/EndPoints';
  import ClientAuth from '../../../services/auth/clientAuth';
  
  export default {
    data() {
      return {
        errors: [],
      };
    },
    props: ['serviceID', 'reviewID', 'visible'],
    methods: {
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
      cancel() {
        this.$emit('cancelDelete');
      },
    },
  };
</script>
