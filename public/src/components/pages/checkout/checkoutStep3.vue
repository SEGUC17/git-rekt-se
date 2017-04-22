<template>
    <div class="step3 box column is-10 is-offset-1">
        <div class="has-text-centered is-success" :class="successClass">
            <i class="el-icon-circle-check"></i>
        </div>
        <p class="content has-text-centered">
            Your transaction has been completed, you will receive an email to confirm your booking.
        </p>
        <div class="viewBookings has-text-centered">
            <el-button type="warning">Your Bookings</el-button> <!-- Needs Client View Bookings -->
        </div>
    </div>
</template>

<script>
   /**
    * This component represents the last step in booking.
    */
    export default {
      /**
       * Data used by the component.
       * successClas: the class of the Success Icon.
       */
      data() {
        return {
          successClass: '',
        };
      },
      /**
       * Ran when the component is mounted on the DOM.
       * Assign successClass to `success-icon`.
       */
      mounted() {
        this.successClass = 'success-icon';
      },
    };
</script>

<style>
    .success-icon {
        transition: all 1s ease;
        font-size: 4rem;
        color: #00d2b2;
    }

     @media screen and (max-width: 999px) {
        .step3 {
            margin: 2em;
        }
    }
</style>
