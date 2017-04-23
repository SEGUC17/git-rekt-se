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
  /**
   * This component allows an Admin to remove a Client.
   */
  import axios from 'axios';
  import { Admin } from '../../services/EndPoints';
  import adminAuth from '../../services/auth/adminAuth';
  import EventBus from '../../services/EventBus';

  export default {
    /**
     * Data used by this component.
     * errors: Error received from server.
     * clients: Clients received from server.
     * email: Chosen Client's Email.
     */
    data() {
      return {
        errors: [],
        clients: [],
        email: '',
      };
    },
    /**
     * Ran when this component is mounted on DOM.
     * If Admin is not authenticated route him back with a message,
     * otherwise Fetch and Display clients and attach the relevant listeners.
     */
    mounted() {
      if (!adminAuth.isAuthenticated()) {
        this.$router.push('/404');
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
    /**
     * Methods used by this component.
     */
    methods: {
      /**
       * Fetch All Clients.
       */
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
