<template>
    <el-button class="button is-success" @click="showAcceptDialog">Accept</el-button>
</template>

<script>
  import axios from 'axios';
  import { Admin } from '../../services/EndPoints';
  import adminAuth from '../../services/auth/adminAuth';
  import EventBus from '../../services/EventBus';

  export default {
    props: ['data', 'row'],
    methods: {
      showAcceptDialog() {
        this.$dialog.confirm({
          title: 'Accept Request',
          message: 'Are you sure you wish to accept this request?',
          hasIcon: true,
          cancelText: 'No',
          confirmText: 'Yes',
          type: 'is-success',
          onConfirm: this.accept,
        });
      },

      accept() {
        const loader = this.$loading({
          fullscreen: true,
        });
        axios.post(Admin().acceptBusiness(this.data), null,
          {
            headers: {
              Authorization: adminAuth.getJWTtoken(),
            },
          })
            .then(() => {
              this.$toast.open({
                title: 'Success!',
                message: 'Request approved!',
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
