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
          <el-icon name="date" class="align-icon"></el-icon>
          <span>{{ new Date(scope.row.date).toLocaleDateString() }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Service Name" header-align="center" prop="_service.name">
      </el-table-column>

      <el-table-column label="Address" header-align="center">
        <template scope="scope">
          <i class="fa fa-location-arrow align-icon location-icon" aria-hidden="true"></i>
          <span>{{ `${scope.row._service.offerings[0].address}, ${scope.row._service.offerings[0].location}` }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Status" header-align="center">
        <template scope="scope">
          <i :class="`fa fa-check-square align-icon ${scope.row.status}`" aria-hidden="true"></i>
          <span>{{ `${scope.row.status}` }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Price" header-align="center">
        <template scope="scope">
          <i class="fa fa-money align-icon" aria-hidden="true"></i>
          <span>{{ `${scope.row._transaction.amount / 100.0} EGP` }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import clientAuth from '../../services/auth/clientAuth';
  import { Client } from '../../services/EndPoints';
  const headers = {
    headers: {
      Authorization: clientAuth.getJWTtoken(),
    },
  };
  export default {
    data() {
      return {
        bookings: [],
        error: false,
        success: false,
        message: '',
      };
    },
    methods: {
      getTransactions() {
        const loader = this.$loading({
          fullscreen: true,
          text: 'Loading Transactions..',
        });
        axios.get(Client().getTransactions, headers)
          .then((res) => {
            this.bookings = res.data.bookings;
            loader.close();
          })
          .catch((err) => {
            this.errors = true;
            this.message = err.response ? err.response.data.errors.join(', ') : err.message;
            loader.close();
          });
      },
    },
    mounted() {
      if(!clientAuth.isAuthenticated()){
        this.$router.push('/');
        this.$toast.open({
          type: 'is-danger',
          position: 'bottom',
          text: 'You must be logged in for such action!',
        });
        return;
      }
      this.getTransactions();
    },
  }
</script>

<style>
  .align-icon {
    margin-top: 5px;
    margin-right: 5px;
  }
  .confirmed {
    color: #00ff00;
  }
  .pending {
    color: #0000ff;
  }
  .rejected {
    color: #ff0000;
  }
  .location-icon {
    color: #1d71f7;
  }
</style>