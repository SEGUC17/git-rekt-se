<template>
    <div class="step1 box content">
        <h3 class="booking-header">Booking Information</h3>
        <div class="field">
            <p class="label">Select Branch</p>
            <el-select class="seventy-width" v-model="form.branch" placeholder="Select Branch">
                <el-option v-for="branch in service.branches" :key="branch._id" :label="branch.address"
                           :value="branch._id"></el-option>
            </el-select>
        </div>

        <div class="field">
            <p class="label">Starting Date</p>
            <el-select class="seventy-width" @change="goToStep2" v-model="form.offering"
                       placeholder="Select Offering" :disabled="form.branch === ''">
                <el-option v-for="offering in service.offerings" v-if="offering.branch === form.branch"
                           :key="offering._id" :label="formatDates(offering.startDate, offering.endDate)"
                           :value="offering"></el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
 /**
  * This component represents the first step in booking a service.
  */
  import moment from 'moment';

  export default {
    /**
     * Props used by this component.
     * service: The service the client wishes to book.
     * form: An Object containing the branch, offering, coupon, and a token.
     */
    props: ['service', 'form'],
    /**
     * Methods used by this component.
     */
    methods: {
     /**
      *  Return date(s) in format
      *  Start date - [Number of days to end date]
      */
      formatDates(startDate, endDate) {
        const momentStartDate = moment(startDate);
        const momentEndDate = moment(endDate);
        return `${momentStartDate.format('MMMM Do YYYY')} - ${momentEndDate.diff(momentStartDate, 'days')} days`;
      },
      /**
       * Check whether data is not empty
       * If it is not emit an event, so parent component
       * can go to the next step in booking.
       */
      goToStep2() {
        const can = this.form.branch !== '' && this.form.offering !== '';
        if (can) {
          this.$emit('reviewBooking');
        }
      },

    },
  };
</script>

<style>
    @media screen and (max-width: 999px) {
        .step1 {
            margin: 1.2em;
        }
    }
</style>
