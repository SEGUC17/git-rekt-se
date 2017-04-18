<template>
    <a class="button" @click="logoutHandler">
        <span class="icon"> <i class="fa fa-sign-out"></i></span>
        <span class="logout-title">{{ title }}</span>
    </a>
</template>

<script>
  import CommonAuth from '../../services/auth/commonAuth';
  import ClientAuth from '../../services/auth/clientAuth';
  import BusinessAuth from '../../services/auth/businessAuth';
  import EventBus from '../../services/EventBus';

  export default{
    props: ['title'],
    methods: {
        /*
         * Handle Logout.
         * */

      logoutHandler() {
        if (!CommonAuth.isAuthenticated()) {
          return;
        }

        const loader = this.$loading({
          fullscreen: true,
        });

        if (ClientAuth.isAuthenticated()) {
          this.clientLogout(loader);
          return;
        }

        if (BusinessAuth.isAuthenticated()) {
          this.businessLogout(loader);
        }
      },

        /*
         * Handle client logout.
         * */

      clientLogout(loader) {
        ClientAuth.logout((responseErrs, response) => {
          let message;

          EventBus.$emit('UpdateNavigation');
          loader.close();
          if (responseErrs) {
            message = responseErrs.errors[0];
          } else {
            message = response.message;
          }

          this.$toast.open({
            message,
            type: 'is-primary',
            position: 'bottom',
          });

          this.$router.push({
            path: '/',
          });
        });
      },

      /**
       * Handle Business Logout.
       */
      businessLogout(loader) {
        BusinessAuth.logout((responseErrs, response) => {
          let message;

          EventBus.$emit('UpdateNavigation');
          console.log(response);
          console.log(responseErrs);
          loader.close();
          if (responseErrs) {
            message = responseErrs.errors[0];
          } else {
            message = response.message;
          }

          this.$toast.open({
            message,
            type: 'is-primary',
            position: 'bottom',
          });

          this.$router.push({
            path: '/',
          });
        });
      },
    },
  };
</script>

<style>
    .logout-title {
        padding-left: 0.3em;
    }
</style>
