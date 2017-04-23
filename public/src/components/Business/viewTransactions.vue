<template>
    <div class="bus-transactions">

        <!-- Errors -->
        <div class="errors">
            <el-alert v-if="error" class="error" @close="error = false" :title="message" type="error"
                      show-icon></el-alert>
            <el-alert v-if="success" class="error" @close="success = false" :title="message" type="success"
                      show-icon></el-alert>
        </div>

        <!-- Bookings -->
        <div class="bookings-table">
            <b-table
                    v-if="bookings.length > 0"
                    :data="bookings"
                    :striped="true"
                    :narrowed="true"
                    :mobile-cards="true"
                    :paginated="true"
                    :per-page="10"
                    :pagination-simple="false"
                    default-sort="date"
                    render-html>

                <b-table-column field="date" label="Date" sortable></b-table-column>
                <b-table-column field="name" label="Service" sortable></b-table-column>
                <b-table-column field="client" label="Client" sortable></b-table-column>
                <b-table-column field="amount" label="Amount" sortable></b-table-column>
                <b-table-column field="status" label="Status" sortable></b-table-column>
                <b-table-column field="id" label="Booking" component="bus-trans-actions"></b-table-column>
            </b-table>

            <!-- No data found. -->
            <div class="no-data hero" v-show="bookings.length === 0">
                <div class="hero-body has-text-centered">
                    <el-icon name="circle-close" class="confirmation-icon icon-fail"></el-icon>
                    <p class="title is-2">No Bookings Found.</p>
                    <a class="button is-info" @click.prevent="getTransactions">Refresh</a>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
  import moment from 'moment';
  import axios from 'axios';
  import businessAuth from '../../services/auth/businessAuth';
  import { Business } from '../../services/EndPoints';
  import EventBus from '../../services/EventBus';

  export default {
    data() {
      return {
        bookings: [],
        success: false,
        error: false,
        message: '',
      };
    },
    methods: {
      getTransactions() {
        const loader = this.$loading({
          fullscreen: true,
        });
        axios.get(Business().getTransactions, {
          headers: {
            Authorization: businessAuth.getJWTtoken(),
          },
        })
            .then((res) => {
              this.bookings = res.data.bookings.map(booking => ({
                date: moment(booking.date).format('MMMM Do YYYY'),
                name: booking._service.name,
                id: booking._id,
                email: booking._client.email,
                client: `${booking._client.firstName} ${booking._client.lastName}`,
                branch: booking._service.offerings[0].location,
                status: booking.status,
                amount: `${booking._transaction.amount / 100.0} EGP`,
                stripe: booking._transaction.stripe_charge,
              }));
              loader.close();
            })
            .catch((err) => {
              this.error = true;
              this.message = err.response ? err.response.data.errors.join(', ') : err.message;
              loader.close();
            });
      },
      acceptTransaction(row) {
        this.success = false;
        this.error = false;
        const data = {
          bookingId: row.id,
          email: row.email,
        };
        const loader = this.$loading({
          fullscreen: true,
        });
        axios.post(Business().acceptTransaction, data, {
          headers: {
            Authorization: businessAuth.getJWTtoken(),
          },
        })
            .then((res) => {
              this.success = true;
              this.message = res.data.message;
              this.getTransactions();
            }).catch((err) => {
              this.error = true;
              this.message = err.response ? err.response.data.errors.join(', ') : err.message;
              loader.close();
            });
      },
      refundTransaction(row) {
        this.success = false;
        this.error = false;
        const data = {
          bookingId: row.id,
          stripeId: row.stripe,
          email: row.email,
        };
        const loader = this.$loading({
          fullscreen: true,
        });
        axios.post(Business().refundTransaction, data, {
          headers: {
            Authorization: businessAuth.getJWTtoken(),
          },
        })
            .then((res) => {
              this.success = true;
              this.message = res.data.message;
              this.getTransactions();
            }).catch((err) => {
              this.error = true;
              this.message = err.response ? err.response.data.errors.join(', ') : err.message;
              loader.close();
            });
      },
    },
    mounted() {
      if (!businessAuth.isAuthenticated()) {
        this.$router.push('/404');
        return;
      }
      this.getTransactions();

      EventBus.$on('acceptTrans', this.acceptTransaction);
      EventBus.$on('refundTrans', this.refundTransaction);
    },
  };
</script>
