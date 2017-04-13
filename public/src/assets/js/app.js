import Bulma from 'bulma';
import Vue from 'vue';
import VueRouter from 'vue-router';
import elementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en'
import Buefy from 'buefy'
import axios from 'axios';
import header from '../../components/shared/header.vue';
import footer from '../../components/shared/footer.vue';
import router from '../../services/routes.js';
Window.axios = axios;

Vue.use(VueRouter);
Vue.use(elementUI, {
  locale
});
Vue.use(Buefy);

new Vue({
  el: '#root',
  router,
  components: {
    sample,
    client: require('../../components/client/signup'),
    'gr-header': header,
    'gr-footer': footer,
  }
});
