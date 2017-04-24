<template>
    <el-button class="button is-success" @click="showAcceptDialog">Accept</el-button>
</template>

<script>
 /**
  * Component that represents an `Accept` Button.
  */
  import axios from 'axios';
  import { Admin } from '../../services/EndPoints';
  import adminAuth from '../../services/auth/adminAuth';
  import EventBus from '../../services/EventBus';

  export default {
    /**
     * Props that this component uses.
     * data: Data that can be displayed in the row.
     * row: row Object representing the current row.
     */
    props: ['data', 'row'],
    /**
     * Methods used by this component.
     */
    methods: {
      /**
       * Show a confirm dialog.
       */
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
      /**
       * Ran when the admin confirms the dialog.
       */
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
              loader.close();
              if(JWTCheck(err)){
                AdminAuth.removeData();
                this.$router.push('/');
                this.$toast.open({
                  message: 'Session Expired, please login',
                  type: 'is-danger',
                  position: 'bottom',
                });
              } else {
                this.errors = err.response.data.errors;
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
              }
            });
      },
    },
  };
</script>
