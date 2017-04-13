import Bulma from 'bulma';
import Vue from 'vue';
import VueRouter from 'vue-router';
import elementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en'
import axios from 'axios';
import sample from '../../components/sample.vue';
import router from '../../services/routes.js';

Window.axios = axios;

Vue.use(VueRouter);
Vue.use(elementUI, {
  locale
});

new Vue({
  el: '#root',
  router,
  components: {
    sample,
    client: require('../../components/client/signup')
  }
});
