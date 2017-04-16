<template>
<el-dialog title="Delete Review" v-model="dialogVisible">
  <el-alert title="Error" type="error" show-icon v-for="error in errors" :description="error"></el-alert>
    <span>This cannot be undone. Delete this review?</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">Cancel</el-button>
      <el-button type="primary" @click="deleteReview">Delete</el-button>
     </span>
  </el-dialog>
</template>

<script>
  import Axios from 'axios';
  import { Service } from '../../../../services/EndPoints';
  
  export default {
    data() {
      return {
        dialogVisible: this.visible,
        reviewID: this.oldReview._id,
        errors: [],
      };
    },
    props: ['serviceID', 'visible'],
    methods: {
      deleteReview() {
        this.errors = [];
        Axios.post(Service.deleteReview(this.serviceID, this.reviewID))
        .then((response) => {
          this.$emit('deleted', response.message);
        })
        .catch((err) => {
          this.errors = err.response.data.errors;
        });
      },
      cancel() {
        this.$emit('cancelDelete');
      },
    },
  };
</script>
