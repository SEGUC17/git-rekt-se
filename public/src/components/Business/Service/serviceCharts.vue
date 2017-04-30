<template>
  <div class="charts">
    <div class="columns is-multiline">
  
      <div class="column is-12">
        <h1 class="title">Charts</h1>
        <hr>
  
        <!-- General Errors -->
        <div class="errors">
          <el-alert v-for="error in generalErrors" :key="error" type="error" :title="error" class="error" show-icon @close="generalErrors.splice(error, 1)">
          </el-alert>
        </div>
  
        <!-- Navigation tabs -->
        <div class="tabs">
          <ul>
            <li @click="active = 1" :class="{ 'is-active': (active === 1) }"><a>Bookings</a></li>
            <li @click="active = 2" :class="{ 'is-active': (active === 2) }"><a>Visitors</a></li>
          </ul>
        </div>
      </div>
  
      <div class="column is-12">
        <h4 class="has-text-centered"><strong class="males">Males</strong> - <strong class="females">Females</strong></h4>
      </div>
  
      <!-- Booking Stats-->
      <div class="column is-half" v-if="active === 1">
        <div class="box">
          <chartist ratio="ct-major-second" type="Bar" :data="bookingCharts.bars.data" :options="bookingCharts.bars.options"></chartist>
          <h4 class="has-text-centered">Age</h4>
        </div>
      </div>
  
      <div class="column is-half" v-if="active === 1">
        <div class="box">
          <chartist ratio="ct-major-second" type="Pie" :data="bookingCharts.pie.data" :options="bookingCharts.pie.options"></chartist>
          <h4 class="has-text-centered">Percentage of bookings</h4>
        </div>
      </div>
      <!-- Visitors Stats-->
      <div class="column is-half" v-if="active === 2">
        <div class="box">
          <chartist ratio="ct-major-second" type="Bar" :data="visitorsCharts.bars.data" :options="visitorsCharts.bars.options"></chartist>
          <h4 class="has-text-centered">Visitors Age</h4>
        </div>
      </div>
  
      <div class="column is-half" v-if="active === 2">
        <div class="box">
          <chartist ratio="ct-major-second" type="Pie" :data="visitorsCharts.pie.data" :options="visitorsCharts.pie.options"></chartist>
          <h4 class="has-text-centered">Percentage of visitors</h4>
        </div>
      </div>
  
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import BusinessAuth from '../../../services/auth/businessAuth';
import { Business } from '../../../services/EndPoints';

export default {
  data() {
    return {
      active: 1,
      generalErrors: [],
      bookingData: {},
      visitorsData: {},
      bookingCharts: {
        pie: {
          data: {
            series: [5, 5],
          },
          options: {
            donut: false,
            labelInterpolationFnc: value => `${Math.round((value / this.bookingData.totalCount) * 100)}%`,
          },
        },
        bars: {
          data: {
            labels: ['13-18', '19-30', '31-50', '51-60', '60+'],
            series: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
          },
          options: {
            scaleMinSpace: 15,
          },
        },
      },
      visitorsCharts: {
        pie: {
          data: {
            series: [5, 5],
          },
          options: {
            donut: false,
            labelInterpolationFnc: value => `${Math.round((value / this.visitorsData.totalCount) * 100)}%`,
          },
        },
        bars: {
          data: {
            labels: ['13-18', '19-30', '31-50', '51-60', '60+'],
            series: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
          },
          options: {
            scaleMinSpace: 15,
          },
        },
      },
    };
  },

  methods: {
    /*
    * Get the data for the charts from the API.
    */

    getCharts() {
      const loader = this.$loading({
        fullscreen: true,
      });
      axios
        .get(Business().statistics(this.$route.params.id), {
          headers: {
            Authorization: BusinessAuth.getJWTtoken(),
          },
        })
        .then((response) => {
          this.visitorsData = response.data.viewingStats;
          this.bookingData = response.data.bookingStats;
          loader.close();
          this.loadCharts();
        })
        .catch((error) => {
          loader.close();
          console.log(error);
          if (!error.response || !error.response.data.errors) {
            this.generalErrors = ['An error occurred with the server. Please try again later.'];
            return;
          }
          this.generalErrors = error.response.data.errors.map((err) => {
            if (typeof err === 'string') {
              return err;
            }
            return err.msg;
          });
        });
    },

    /*
    * Load the data into the charts.
    */

    loadCharts() {
      console.log(this.visitorsData);
      this.visitorsCharts.pie.data.series = [this.visitorsData.totalFemaleCount,
        this.visitorsData.totalMaleCount];

      this.bookingCharts.pie.data.series = [this.bookingData.totalFemaleCount,
        this.bookingData.totalMaleCount];

      const femaleVisitors = [];
      femaleVisitors.push(this.visitorsData.age13to18FemaleCount);
      femaleVisitors.push(this.visitorsData.age19to24FemaleCount
        + this.visitorsData.age25to30FemaleCount);
      femaleVisitors.push(this.visitorsData.age31to40FemaleCount
        + this.visitorsData.age41to50FemaleCount);
      femaleVisitors.push(this.visitorsData.age51to60FemaleCount);
      femaleVisitors.push(this.visitorsData.age61to74FemaleCount
        + this.visitorsData.age75plusFemaleCount);

      const maleVisitors = [];
      maleVisitors.push(this.visitorsData.age13to18MaleCount);
      maleVisitors.push(this.visitorsData.age19to24MaleCount
        + this.visitorsData.age25to30MaleCount);
      maleVisitors.push(this.visitorsData.age31to40MaleCount
        + this.visitorsData.age41to50MaleCount);
      maleVisitors.push(this.visitorsData.age51to60MaleCount);
      maleVisitors.push(this.visitorsData.age61to74MaleCount
        + this.visitorsData.age75plusMaleCount);
      this.visitorsCharts.bars.data.series = [femaleVisitors, maleVisitors];

      const femaleBookings = [];
      const MaleBookings = [];

      femaleBookings.push(this.bookingData.age13to18FemaleCount);
      femaleBookings.push(this.bookingData.age19to24FemaleCount
        + this.bookingData.age25to30FemaleCount);
      femaleBookings.push(this.bookingData.age31to40FemaleCount
        + this.bookingData.age41to50FemaleCount);
      femaleBookings.push(this.bookingData.age51to60FemaleCount);
      femaleBookings.push(this.bookingData.age61to74FemaleCount
        + this.bookingData.age75plusFemaleCount);

      MaleBookings.push(this.bookingData.age13to18MaleCount);
      MaleBookings.push(this.bookingData.age19to24MaleCount
        + this.bookingData.age25to30MaleCount);
      MaleBookings.push(this.bookingData.age31to40MaleCount
        + this.bookingData.age41to50MaleCount);
      MaleBookings.push(this.bookingData.age51to60MaleCount);
      MaleBookings.push(this.bookingData.age61to74MaleCount
        + this.bookingData.age75plusMaleCount);

      console.log(femaleBookings);
      console.log(MaleBookings);

      this.bookingCharts.bars.data.series = [femaleBookings, MaleBookings];
    },
  },

  mounted() {
    if (!BusinessAuth.isAuthenticated()) {
      this.$router.push('/404');
      return;
    }
    this.getCharts();
  },
};

</script>

<style>
.ct-series-b .ct-area,
.ct-series-b .ct-slice-donut-solid,
.ct-series-b .ct-slice-pie,
.ct-series-a .ct-bar,
.ct-series-a .ct-line,
.ct-series-a .ct-point,
.ct-series-a .ct-slice-donut,
.males {
  color: #00d1b2;
  fill: #00d1b2;
  stroke: #00d1b2;
}

.ct-series-a .ct-area,
.ct-series-a .ct-slice-donut-solid,
.ct-series-a .ct-slice-pie,
.ct-series-b .ct-bar,
.ct-series-b .ct-line,
.ct-series-b .ct-point,
.ct-series-b .ct-slice-donut,
.females {
  fill: #276cda;
  color: #276cda;
  stroke: #276cda;
}

.ct-chart-donut .ct-label,
.ct-chart-pie .ct-label {
  fill: rgba(255, 255, 255, 1);
  font-size: 0.9rem;
}

.chart-total {
  color: rgba(0, 0, 0, .4);
}
</style>
