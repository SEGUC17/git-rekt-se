<template>
  <header>
    <nav class="nav">
      <div class="container">
        <!-- Navigation bar Left -->
        <div class="nav-left">
          <router-link to="/#" class="logo nav-item" @click.native="active = false">
            <img src="assets/imgs/logo.svg" alt="logo">
          </router-link>
        </div>

        <span class="nav-toggle" @click="active = !active">
                    <span></span>
                    <span></span>
                    <span></span>
        </span>

        <!-- Navigation bar Right -->
        <div class="nav-right nav-menu" :class="active? 'is-active' : ''">
          <router-link to="/about" @click.native="active = false" class="nav-item">About Us

          </router-link>
          <router-link v-if="!isBusiness" to="/business/apply"
                       @click.native="active = false" class="nav-item">
            Apply

          </router-link>

          <div class="nav-item">

            <router-link class="button is-default gr-nav-button" to="/client/signup"
                         v-if="!isAuthenticated" @click.native="active = false">
                            <span class="icon">
                                <i class="fa fa-user"></i>
                            </span>
              <span>Signup</span>
            </router-link>

            <router-link class="button is-danger gr-nav-button" to="/login"
                         v-if="!isAuthenticated" @click.native="active = false">
                            <span class="icon">
                                <i class="fa fa-sign-in"></i>
                            </span>
              <span>Login</span>
            </router-link>

            <!-- Business Account Management-->
            <router-link v-if="isBusiness" to="/business/manage" class="button is-success">
              Manage

            </router-link>

            <!-- Admin Dashboard-->
            <router-link v-if="isAdmin" to="/admin/dashboard" class="button is-info">
              Dashboard

            </router-link>

            <!-- Client Account -->
            <el-dropdown v-if="isClient" @command="handleProfile" menu-align="start"
                         trigger="hover">
              <el-button type="success gr-nav-button">
                My Account<i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>

              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit">Edit Profile</el-dropdown-item>
                <el-dropdown-item command="bookings">My Bookings</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <logout-btn class="is-danger gr-nav-button" v-if="isAuthenticated"
                        title="Logout"></logout-btn>
          </div>

        </div>
      </div>
    </nav>
  </header>
</template>

<script>
  /**
   * This component represents a NavBar, responsible for navigating
   * through the website.
   */
  import CommonAuth from '../../services/auth/commonAuth';
  import ClientAuth from '../../services/auth/clientAuth';
  import BusinessAuth from '../../services/auth/businessAuth';
  import AdminAuth from '../../services/auth/adminAuth';
  import EventBus from '../../services/EventBus';
  import LogoutBtn from './logout.vue';

  export default {
    /**
     * Data Used By The Component.
     */
    data() {
      return {
        active: false,
        isAuthenticated: CommonAuth.isAuthenticated(),
        isClient: ClientAuth.isAuthenticated(),
        isBusiness: BusinessAuth.isAuthenticated(),
        isAdmin: AdminAuth.isAuthenticated(),
      };
    },
    /**
     * Sub-components, Any components used by this component.
     */
    components: {
      'logout-btn': LogoutBtn,
    },
    /**
     * This will run when the component is mounted on the DOM.
     * Update `isAuthenticated` with whether client/business is authenticated.
     */
    mounted() {
      EventBus.$on('UpdateNavigation', () => {
        this.isAuthenticated = CommonAuth.isAuthenticated();
        this.isClient = ClientAuth.isAuthenticated();
        this.isBusiness = BusinessAuth.isAuthenticated();
        this.isAdmin = AdminAuth.isAuthenticated();
        this.active = false;
      });
    },

    methods: {
      handleProfile(navigate) {
        this.active = false;
        this.$router.push(`/client/profile/${navigate}`);
      },
    },
  };
</script>

<style>
  .logo {
    overflow: hidden;
  }

  .gr-nav-button {
    margin: 10px;
  }

  .nav-item .button + .button {
    margin-left: 0.75rem;
  }

  .nav {
    height: 100%;
    border-bottom: 1px solid #eee;
  }

  .no-link {
    color: white !important;
  }

</style>