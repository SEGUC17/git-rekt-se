<template>
  <div> 

    <div class="column is-half is-offset-one-quarter" v-show="success || error">
      <div v-show="error">
        <el-alert @close="error = false" :title="message" type="error" show-icon></el-alert>
      </div>

      <div v-show="success">
        <el-alert @close="success = false" :title="message" type="success" show-icon></el-alert>
      </div>  
    </div>

    <el-table :data="bookings" border>

      <el-table-column label="Date" header-align="center">
        <template scope="scope">
          <el-icon name="date"></el-icon>
          <span>{{ new Date(scope.row.date).toLocaleDateString() }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Service Name" prop="_service.name" header-align="center">
      </el-table-column>
  
      <el-table-column label="Client Name" header-align="center">
        <template scope="scope">
          {{ scope.row._client.firstName + ' ' + scope.row._client.lastName }}
        </template>
      </el-table-column>
      
      <el-table-column label="Address" header-align="center">
        <template scope="scope">
          {{ scope.row._service.offerings[0].address + ', ' + scope.row._service.offerings[0].location }}
        </template>
      </el-table-column>

      <el-table-column label="Amount" header-align="center">
        <template scope="scope">
          {{ `${scope.row._transaction.amount / 100.0} EGP`}}
        </template>
      </el-table-column>

      <el-table-column label="Status" prop="status" header-align="center">
      </el-table-column>

      <el-table-column label="Actions" header-align="center">
      <template scope="scope">

        <el-tooltip content="Accept Transaction" placement="top">
          <el-button size="small" type="success" icon="circle-check" @click="acceptTransaction(scope)">Accept</el-button>
        </el-tooltip>

        <el-tooltip content="Refund Transaction" placement="top">
          <el-button size="small" type="danger" icon="circle-cross" @click="rejectTransaction(scope)">Reject</el-button>
        </el-tooltip>

      </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import businessAuth from '../../services/auth/businessAuth';
  import {
    Business
  } from '../../services/EndPoints';
  const headers = {
    headers: {
      Authorization: businessAuth.getJWTtoken(),
    },
  };
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
          text: 'Fetching Transactions..',
        });
        axios.get(Business().getTransactions, headers)
          .then((res) => {
            this.bookings = res.data.bookings;
            loader.close();
          })
          .catch((err) => {
            this.error = true;
            this.message = err.response ? err.response.data.errors.join(', ') : err.message;
            loader.close();
          });
      },
      acceptTransaction(scope) {
        this.success = false;
        this.error = false;
        const data = {
          bookingId: scope.row._id,
          email: scope.row._client.email,
        };
        const loader = this.$loading({
          fullscreen: true,
          text: 'Fetching Transactions..',
        });
        axios.post(Business().acceptTransaction, data, headers)
          .then((res) => {
            this.success = true;
            this.message =  res.data.message;
            this.bookings[scope.$index].status = 'confirmed';
            loader.close();
          }).catch((err) => {
            this.error = true;
            this.message = err.response ? err.response.data.errors.join(', ') : err.message;
            loader.close();
          });
      },
      rejectTransaction(scope) {
        this.success = false;
        this.error = false;
        const data = {
          bookingId: scope.row._id,
          stripeId: scope.row._transaction.stripe_charge,
          email: scope.row._client.email,
        };
        const loader = this.$loading({
          fullscreen: true,
          text: 'Fetching Transactions..',
        });
        axios.post(Business().refundTransaction, data, headers)
          .then((res) => {
            this.success = true;
            this.message = res.data.message;
            this.bookings[scope.$index].status = 'rejected';
            loader.close();
          }).catch((err) => {
            this.error = true;
            this.message = err.response ? err.response.data.errors.join(', ') : err.message;
            loader.close();
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