<template>
    <div class="resend-email box">
        <div class="content">
            <h1 class="has-text-centered">Go to your mailbox!</h1>
            <p class="has-text-centered">
                We just sent you an e-mail to {{ email }} with activation link.
                Please click the link to activate your account.
            </p>
            <hr>

            <div class="resend has-text-centered">
                <h2>E-mail didn't come?</h2>
                <p>
                    If e-mail didn't come within 2 minutes, Click to resend the email.
                </p>
                <el-button type="primary" @click="resendEmail">Resend Email</el-button>
            </div>
        </div>
    </div>
</template>

<script>
  import axios from 'axios';
  import { Client } from '../../services/EndPoints';

  export default {
    props: ['email'],
    data() {
      return {
        lastEmailReset: Date.now(),
      };
    },
    methods: {
      resendEmail() {
        const currentTime = Date.now();
        const diff = currentTime - this.lastEmailReset;
          /*
           * Check If 2 minutes passed.
           * */
        if (diff < 120000) {
          this.$toast.open({
            message: `Please wait ${Math.floor((120000 - diff) / 1000)} seconds before requesting to send confirmation mail again.`,
            position: 'bottom',
            type: 'is-warning',
          });
          return;
        }

        this.lastEmailReset = currentTime;
  
        axios
            .post(Client().resend, {
              email: this.email,
            })
            .then((response) => {
              this.$toast.open({
                message: response.data.message,
                position: 'bottom',
                type: 'is-primary',
              });
            })
            .catch(() => {
              this.$toast.open({
                message: 'Failed to send confirmation email.',
                position: 'bottom',
                type: 'is-danger',
              });
            });
      },
    },
  };
</script>

<style>
    .resend-email {
        border-radius: 0;
        padding: 2em;
    }
</style>
