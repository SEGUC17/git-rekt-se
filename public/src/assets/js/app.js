import Vue from 'vue';
import VueRouter from 'vue-router';
import elementUI from 'element-ui';
import Buefy from 'buefy'
import axios from 'axios';
import moment from 'moment';
import header from '../../components/shared/header.vue';
import footer from '../../components/shared/footer.vue';
import router from '../../services/routes.js';

window.axios = axios;
window.moment = moment;

Vue.use(VueRouter);
Vue.use(elementUI);
Vue.use(Buefy);

new Vue({
  el: '#root',
  router,
  components: {
    'gr-header': header,
    'gr-footer': footer,
  }
});
