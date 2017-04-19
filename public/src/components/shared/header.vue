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

                    <router-link to="/#" @click.native="active = false" class="nav-item">Home</router-link>
                    <router-link to="/about" @click.native="active = false" class="nav-item">About Us</router-link>
                    <router-link to="/categories" @click.native="active = false" class="nav-item">Categories</router-link>
                    <router-link to="/business/apply" @click.native="active = false" class="nav-item">Business APPLY</router-link>

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
                            <span>Signup</span>
                        </router-link>

                        <logout-btn class="is-danger gr-nav-button" v-if="isAuthenticated" title="Logout"></logout-btn>
                    </div>

                </div>
            </div>
        </nav>
    </header>
</template>

<script>

  import CommonAuth from '../../services/auth/commonAuth';
  import EventBus from '../../services/EventBus';
  import LogoutBtn from './logout.vue';

  export default {
    data() {
      return {
        active: false,
        isAuthenticated: CommonAuth.isAuthenticated(),
      };
    },
    components: {
      'logout-btn': LogoutBtn,
    },

    mounted() {
      EventBus.$on('UpdateNavigation', () => {
        this.isAuthenticated = CommonAuth.isAuthenticated();
      });
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

    .nav {
        border-bottom: 1px solid #eee;
    }

    .no-link {
        color: white !important;
    }

</style>