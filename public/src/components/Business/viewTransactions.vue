<template>
  
</template>

<script>
  import businessAuth from '../../services/auth/businessAuth';
  import {
    Business
  } from '../../services/EndPoints';
  export default {
    data() {
      return {
  
      };
    },
    methods: {
      getTransactions() {
        axios.get(Business().getTransactions, {
            headers: businessAuth.getJWTtoken(),
          })
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => {
            console.log(err.response);
          });
      },
    },
    mounted() {
      if (!businessAuth.isAuthenticated()) {
        this.$router.push('/');
        this.$toast.open({
          type: 'is-danger',
          message: 'You are not logged in!',
          position: 'bottom',
        });
        return;
      }
      this.getTransactions();
    }
  }
</script>