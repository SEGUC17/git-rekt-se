<template>
    <el-button class="button is-danger" @click="showRejectDialog">Reject</el-button>
</template>

<script>
  import axios from 'axios';
  import { Admin } from '../../services/EndPoints';
  import adminAuth from '../../services/auth/adminAuth';
  import EventBus from '../../services/EventBus';

  export default {
    props: ['data', 'row'],
    data() {
      return {
        acceptDialogue: false,
      };
    },
    methods: {
      showRejectDialog() {
        this.$dialog.confirm({
          title: 'Reject Request',
          message: 'Are you sure you wish to reject this request?',
          hasIcon: true,
          cancelText: 'No',
          confirmText: 'Yes',
          type: 'is-danger',
          onConfirm: this.reject,
        });
      },

      reject() {
        const loader = this.$loading({
          fullscreen: true,
        });
        axios.post(Admin().denyBusiness(this.data), null,
            {
              headers: {
                Authorization: adminAuth.getJWTtoken(),
              },
            })
            .then(() => {
              this.$toast.open({
                message: 'Request Rejected!',
                type: 'is-success',
              });
              EventBus.$emit('BusinessConfirmed', this.row);
              this.errors = [];
              loader.close();
            })
            .catch((err) => {
              this.errors = err.response.data.errors;
              document.body.scrollTop = 0;
              document.documentElement.scrollTop = 0;
              loader.close();
            });
      },
    },
  };
</script>
