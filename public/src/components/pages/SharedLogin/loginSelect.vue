<template>
    <div class="login-select">

        <!-- Sign In in the top-->
        <section class="signin-top hero is-bold">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title extra-large white">
                        Sign In
                    </h1>
                </div>
            </div>
        </section>

        <!-- SignIn types -->
        <div class="columns">
            <div class="column signin-client is-5 is-offset-1 no-margin-bottom">
                <div class="client-desc">
                    <p class="title is-spaced"> Client </p>
                    <hr/>
                    <p class="subtitle is-bold"> Book services, view your bookings and unlock achievements.</p>
                    <router-link tag="el-button" to="/client/login" class="el-button--default el-button--large">
                        Client Sign In

                    </router-link>
                </div>
            </div>

            <div class="signin-bus column is-5 no-margin-bottom">
                <div class="bus-desc">
                    <p class="title is-spaced"> Business </p>
                    <hr/>
                    <p class="subtitle is-bold"> Manage your bookings, services and engage with your clients. </p>
                    <router-link tag="el-button" to="/business/login" class="el-button--default el-button--large">
                        Business Sign In

                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Authenticator from '../../../services/auth/commonAuth';

  export default{
    mounted() {
      if (Authenticator.isAuthenticated()) {
        this.$router.push('/');
        this.$toast.open({
          message: 'You are already logged in.',
          type: 'is-danger',
          position: 'bottom',
        });
      }
    },
  };
</script>

<style>
    .signin-top {
        background: #C33764; /* fallback for old browsers */
        background: -webkit-linear-gradient(to right, #1D2671, #C33764); /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(to right, #1D2671, #C33764); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        margin-bottom: 2em;
    }

    .signin-bus,
    .signin-client {
        border-radius: 0;
        margin: 0.3em;
    }

    .client-desc,
    .bus-desc {
        padding: 2em;
    }

    .client-desc .subtitle,
    .bus-desc .subtitle {
        width: 80%;
        line-height: 1.5em !important;
    }

    .no-margin-bottom {
        margin-bottom: 0 !important;
    }
</style>
