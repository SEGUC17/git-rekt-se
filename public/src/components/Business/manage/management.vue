<template>
  <div class="manage-business">

    <gr-top-hero class="admin-dashbaord-top" title="Manage"></gr-top-hero>
    <div class="columns container is-fluid margin-mobile">
      <!-- Side Menu -->
      <div class="column is-3">
        <aside class="menu">
          <p class="menu-label">
            Information
          </p>
          <ul class="menu-list">
            <li>
              <router-link to="/business/manage/edit/basic">Basic Information</router-link>
            </li>
            <li>
              <router-link to="/business/manage/edit/info">Listing Information</router-link>
            </li>
            <li>
              <router-link to="/business/manage/edit/branches">Branches</router-link>
            </li>
            <li>
              <router-link to="/business/manage/gallery">Gallery</router-link>
            </li>
          </ul>
          <p class="menu-label">
            Services
          </p>
          <ul class="menu-list">
            <li>
              <router-link to="/business/manage/services/create">Create</router-link>
            </li>
            <li>
              <router-link to="/business/manage/services/edit">Edit</router-link>
            </li>
          </ul>
        </aside>
      </div>

      <!-- Content Component -->
      <div class="column is-9">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import tophero from '../../shared/gr-top-hero.vue';
  import adminAuth from '../../../services/auth/adminAuth';

  export default {
    components: {
      'gr-top-hero': tophero,
    },

    mounted() {
      if (!adminAuth.isAuthenticated()) {
        this.$router.push('/404');
      }
    },

  };
</script>

<style>
  .admin-dashbaord-top {
    background: #485563; /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #29323c, #485563); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #29323c, #485563); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    margin-bottom: 2em;
  }

  @media screen and (max-width: 999px) {
    .margin-mobile {
      margin: 1em;
    }
  }
</style>