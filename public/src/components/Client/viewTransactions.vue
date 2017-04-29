<template>

    <div class="client-transaction">
        <gr-top-hero class="client-bookings-top" title="Bookings"></gr-top-hero>
        <div class="columns container is-fluid margin-mobile">
            <div class="column is-10 is-offset-1">

                <div class="errors">
                    <div v-show="error">
                        <el-alert @close="error = false" class="error" :title="message" type="error"
                                  show-icon></el-alert>
                    </div>

                    <div v-show="success">
                        <el-alert @close="success = false" class="error" :title="message" type="success"
                                  show-icon></el-alert>
                    </div>
                </div>

                <b-table
                        v-if="bookings.length > 0"
                        :data="bookings"
                        :striped="true"
                        :narrowed="false"
                        :mobile-cards="true"
                        :paginated="true"
                        :per-page="10"
                        :pagination-simple="false"
                        default-sort="date"
                        render-html>

                    <b-table-column field="date" label="Date" sortable></b-table-column>
                    <b-table-column field="name" label="Service" :format="getServiceLink" sortable></b-table-column>
                    <b-table-column  field="location" label="Location" sortable></b-table-column>
                    <b-table-column field="status" label="Status" sortable></b-table-column>
                    <b-table-column field="amount" label="Price" sortable></b-table-column>
                </b-table>

                <!-- No data found. -->
                <div class="no-data hero" v-show="bookings.length === 0">
                    <div class="hero-body has-text-centered">
                        <el-icon name="circle-close" class="confirmation-icon icon-fail"></el-icon>
                        <p class="title is-2">No Bookings Found.</p>
                        <a class="button is-info" @click.prevent="getBookings">Refresh</a>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
 /**
  * This component is reponsible for viewing the client's transactions.
  */
  import axios from 'axios';
  import moment from 'moment';
  import clientAuth from '../../services/auth/clientAuth';
  import { Client } from '../../services/EndPoints';
  import JWTCheck from '../../services/JWTErrors';

  export default {
    /**
     * Data used by this component.
     * bookings: Array of client bookings.
     * error: true if an error occured, false otherwise.
     * success: true if a successful operation occured, false otherwise.
     * message: Message to display to the user.
     */
    data() {
      return {
        bookings: [],
        error: false,
        success: false,
        message: '',
      };
    },
    /**
     * All Methods used by this component.
     */
    methods: {
      /**
       * Get the Client bookings.
       */
      getBookings() {
        const loader = this.$loading({
          fullscreen: true,
          text: 'Loading Bookings..',
        });
        axios.get(Client().getBookings, {
          headers: {
            Authorization: clientAuth.getJWTtoken(),
          },
        })
            .then((res) => {
              this.bookings = res.data.bookings.map(booking => ({
                id: booking._service._id,
                name: booking._service.name,
                date: moment(booking.date).format('dddd MMMM Do YYYY'),
                location: `${booking._service.offerings[0].address},${booking._service.offerings[0].location}`,
                status: booking.status,
                amount: `${booking._transaction.amount / 100.0} EGP`,
              }));
              loader.close();
            })
            .catch((err) => {
              loader.close();
              if (err.response && JWTCheck(err.response.data.errors)) {
                clientAuth.removeData();
                this.$router.push('/');
                this.$toast.open({
                  message: 'Session Expired, please login',
                  type: 'is-danger',
                  position: 'bottom',
                });
              } else {
                this.error = true;
                this.message = err.response ? err.response.data.errors.join(', ') : err.message;
              }
            });
      },

      /**
      * Return a link to service page.
      */

      getServiceLink(value, row) {
        return `<a class="dark-link" href="/service/${row.id}">${value}</a>`;
      },
    },
    /**
     * Ran when the component is mounted.
     * Route back if user isnot authenticated, otherwise get All Bookings.
     */
    mounted() {
      if (!clientAuth.isAuthenticated()) {
        this.$router.push('/404');
        return;
      }
      this.getBookings();
    },
  };
</script>

<style>
   .client-bookings-top {
       background: #43C6AC;  /* fallback for old browsers */
       background: -webkit-linear-gradient(to right, #191654, #43C6AC);  /* Chrome 10-25, Safari 5.1-6 */
       background: linear-gradient(to right, #191654, #43C6AC); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
   }
</style>
