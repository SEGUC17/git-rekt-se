<template>
    <div class="confirm-email">

        <!-- Client Reset password top header -->
        <section class="client-forgot-top hero is-bold">
            <div class="hero-body">
                <div class="container has-text-centered">
                    <h1 class="title extra-large white">
                        Reset Password
                    </h1>
                    <p class="subtitle white">
                        Thanks for confirming your email, you can now enjoy the features of a registered user.
                    </p>
                </div>
            </div>
        </section>

    </div>
</template>

<script>
  import clientAuth from '../../services/auth/clientAuth';

  export default {
    data() {
      return {
        confirmationSuccess: '',
        confirmed: false,
        errors: [],
      };
    },
    mounted() {
      clientAuth.confirmEmail(this.$route.params.token, (responseErrs, response) => {
        console.log(11);
        if (responseErrs) {
          this.errors = responseErrs.errors;
        } else {
          this.confirmationSuccess = response.message;
          this.confirmed = true;
//          setTimeout(() => {
//            this.$router.push('/');
//          }, 1000);
        }
      });
    },
  };
</script>

<style>
    .email-confirmed {
        border-radius: 0;
        padding: 2em;
    }

    .confirm-email{
        background: #67B26F !important; /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #4ca2cd, #67B26F) !important; /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #4ca2cd, #67B26F) !important; /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    }
</style>

