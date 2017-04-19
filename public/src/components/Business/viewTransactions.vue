<template>
  <div>
    <div class="column is-half is-offset-one-quarter" v-show="error">
      <el-alert @close="error = false" :title="message" type="error" show-icon></el-alert>
    </div>

    <el-table :data="bookings" border>
      <el-table-column label="Service Name" prop="_service.name">
      </el-table-column>
  
      <el-table-column label="Client Name" prop="_client.firstName">
      </el-table-column>
      
      <el-table-column label="Address" prop="_offering.address">
      </el-table-column>

      <el-table-column label="Amount" prop="_transaction.amount">
      </el-table-column>

      <el-table-column label="Status" prop="status">
      </el-table-column>

      <el-table-column label="Actions">
      <template scope="scope">
        <el-tooltip content="Accept Transaction" placement="top">
          <el-button type="success" icon="circle-check" @click="acceptTransaction">Accept</el-button>
        </el-tooltip>

        <el-tooltip content="Refund Transaction" placement="top">
          <el-button type="danger" icon="circle-cross" @click="rejectTransaction">Reject</el-button>
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
  export default {
    data() {
      return {
        bookings: [],
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
        axios.get(Business().getTransactions, {
            headers: {
              Authorization: businessAuth.getJWTtoken(),
            },
          })
          .then((res) => {
            console.log(res);
            console.log(res.data);
            this.bookings = res.data.bookings;
            loader.close();
          })
          .catch((err) => {
            console.log(err);
            console.log(err.response);
            loader.close();
          });
      },
      acceptTransaction() {

      },
      rejectTransaction() {

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