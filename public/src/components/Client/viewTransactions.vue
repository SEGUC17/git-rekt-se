<template>
  <div>
    <el-table :data="bookings" border>
      <el-table-column label="Date">
        <template scope="scope">
          <el-icon name="date"></el-icon>
          <span>{{ new Date(scope.row.date).toLocaleDateString() }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Service Name" prop="_service.name">
      </el-table-column>

      <el-table-column label="Address">
        <template scope="scope">
          <i class="fa fa-location-arrow align-icon" aria-hidden="true"></i>
          <span>{{ `${scope.row._offering.address}, ${scope.row._offering.location}` }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Status">
        <template scope="scope">
          <i :class="`fa fa-check-square align-icon ${scope.row.status}`" aria-hidden="true"></i>
          <span>{{ `${scope.row.status}` }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Price">
        <template scope="scope">
          <i class="fa fa-money align-icon" aria-hidden="true"></i>
          <span>{{ `${scope.row._offering.price} EGP` }}</span>
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
        axios.get(Client().getTransactions, headers)
          .then((res) => {
            this.bookings = res.data.bookings;
          })
          .catch((err) => {
            this.errors = true;
            this.message = err.response ? err.response.data.errors.join(', ') : err.message;
          });
      },
    },
    mounted() {
      if(!clientAuth.isAuthenticated){
        this.router.push('/');
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
</style>