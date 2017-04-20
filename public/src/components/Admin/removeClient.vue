<template>
    <div class="remove-client">
        <div class="errors" v-show="errors.length > 0">
            <el-alert v-for="error in errors" class="error" :title="error"
                      type="error" :key="error" show-icon></el-alert>
        </div>

        <b-table
                v-if="clients.length > 0"
                :data="clients"
                :striped="true"
                :narrowed="false"
                :mobile-cards="true"
                :paginated="true"
                :per-page="10"
                :pagination-simple="false"
                default-sort="name"
                render-html>

            <b-table-column field="firstName" label="First Name" sortable></b-table-column>
            <b-table-column field="lastName" label="Last Name" sortable></b-table-column>
            <b-table-column field="email" label="Email"></b-table-column>
            <b-table-column field="_id" component="client-remove-btn"></b-table-column>
        </b-table>

        <!-- No data found. -->
        <div class="no-data hero" v-show="clients.length === 0">
            <div class="hero-body has-text-centered">
                <el-icon name="circle-close" class="confirmation-icon icon-fail"></el-icon>
                <p class="title is-2">No Users Found.</p>
                <a class="button is-info" @click.prevent="getClients">Refresh</a>
            </div>
        </div>
    </div>
</template>

<script>
  import axios from 'axios';
  import { Admin } from '../../services/EndPoints';
  import adminAuth from '../../services/auth/adminAuth';
  import EventBus from '../../services/EventBus';

  export default {
    data() {
      return {
        errors: [],
        clients: [],
        email: '',
      };
    },
    mounted() {
      if (!adminAuth.isAuthenticated()) {
        this.$router.push('/');
        this.$toast.open({
          message: 'Not authorized to do such an operation.',
          position: 'bottom',
          type: 'is-danger',
        });
        return;
      }
      this.getClients();

      EventBus.$on('ClientRemoved', () => {
        this.getClients();
      });

      EventBus.$on('ClientRemoveError', (errors) => {
        this.errors = errors;
      });
    },
    methods: {
      getClients() {
        const loader = this.$loading({
          fullscreen: true,
        });

        axios
            .post(Admin().listClients, {}, {
              headers: {
                Authorization: adminAuth.getJWTtoken(),
              },
            })
            .then((response) => {
              loader.close();
              this.clients = response.data.results;
              this.errors = [];
            })
            .catch((err) => {
              this.errors = err.resposne.data.errors.map((e) => {
                if (typeof e === 'string') {
                  return e;
                }
                return e.msg;
              });
              loader.close();
              this.clients = [];
            });
      },
    },
  };
</script>

<style>

</style>
