<template>
    <div class="step1 box">
        <h1 class="title is-4">Booking Information</h1>
        <hr/>

        <div class="field">
            <p class="label">Select Branch</p>
            <el-select class="seventy-width" v-model="form.branch" placeholder="Select Branch">
                <el-option v-for="branch in service.branches" :key="branch._id" :label="branch.address"
                           :value="branch._id"></el-option>
            </el-select>
        </div>

        <div class="field">
            <p class="label">Starting Date</p>
            <el-select class="seventy-width" @change="$emit('reviewBooking')" v-model="form.offering"
                       placeholder="Select Offering" :disabled="form.branch === ''">
                <el-option v-for="offering in service.offerings" v-if="offering.branch === form.branch"
                           :key="offering._id" :label="formatDates(offering.startDate, offering.endDate)"
                           :value="offering"></el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
  import moment from 'moment';

  export default {
    props: ['service', 'form'],
    methods: {
        /*
         *  Return date(s) in format
         *  Start date - [Number of days to end date]
         */

      formatDates(startDate, endDate) {
        const momentStartDate = moment(startDate);
        const momentEndDate = moment(endDate);
        return `${momentStartDate.format('MMMM Do YYYY')} - ${momentEndDate.diff(momentStartDate, 'days')} days`;
      },
    },
  };
</script>
