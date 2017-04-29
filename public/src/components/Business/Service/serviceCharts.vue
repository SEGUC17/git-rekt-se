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
          <h4 class="has-text-centered">Age</h4>
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
            series: [10, 0],
          },
          options: {
            donut: false,
            labelInterpolationFnc: value => `${Math.round((value / 10) * 100)}%`,
          },
        },
        bars: {
          data: {
            labels: ['13-18', '19-30', '31-50', '51-60', '60+'],
            series: [[1, 2, 3, 13, 5], [1, 10, 5, 2, 3]],
          },
          options: {
            scaleMinSpace: 15,
            high: 30,
          },
        },
      },
      visitorsCharts: {
        pie: {
          data: {
            series: [3, 7],
          },
          options: {
            donut: false,
            labelInterpolationFnc: value => `${Math.round((value / 10) * 100)}%`,
          },
        },
        bars: {
          data: {
            labels: ['13-18', '19-30', '31-50', '51-60', '60+'],
            series: [[1, 2, 3, 13, 5], [1, 10, 5, 2, 3]],
          },
          options: {
            scaleMinSpace: 15,
            high: 30,
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
          this.visitorsData = response.body.viewingStats;
          this.bookingData = response.body.bookingStats;
          loader.close();
          this.loadCharts();
        })
        .catch((error) => {
          loader.close();
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
