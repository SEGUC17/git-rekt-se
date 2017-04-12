import Vue from 'vue';
import VueRouter from 'vue-router';
import elementUI from 'element-ui';
import axios from 'axios';
import header from '../../components/shared/header.vue';
import router from '../../services/routes.js';

Window.axios = axios;

Vue.use(VueRouter);
Vue.use(elementUI);

new Vue({
  el: '#root',
  router,
  components: {
    'gr-header': header,
  }
});
