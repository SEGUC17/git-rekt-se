<template>
    <el-button class="button is-danger" @click="showRejectDialog">Reject</el-button>
</template>

<script>
 /**
  * This component represents a `Reject` button.
  */
  import axios from 'axios';
  import { Admin } from '../../services/EndPoints';
  import adminAuth from '../../services/auth/adminAuth';
  import EventBus from '../../services/EventBus';
  import JWTCheck from '../../services/JWTErrors';

  export default {
    /**
     * Props used by this component.
     * data: Data that can be displayed in the row.
     * row: row Object representing the current row.
     */
    props: ['data', 'row'],
    /**
     * Data used by the component.
     */
    data() {
      return {
        acceptDialogue: false,
      };
    },
    /**
     * Methods used by this component.
     */
    methods: {
      /**
       * Show a confirm dialog
       */
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
      /**
       * Reject a Business.
       */
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
              loader.close();
              if (JWTCheck(err)) {
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
