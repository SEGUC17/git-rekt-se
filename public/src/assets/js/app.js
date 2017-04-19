import Vue from 'vue';
import VueRouter from 'vue-router';
import elementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en'
import Buefy from 'buefy'
import axios from 'axios';
import header from '../../components/shared/header.vue';
import footer from '../../components/shared/footer.vue';
import clientLogin from '../../components/Client/login.vue';
import confirmEmail from '../../components/Client/confirmEmail.vue';
import router from '../../services/routes.js';

window.axios = axios;

Vue.use(VueRouter);
Vue.use(elementUI, {
  locale
});
Vue.use(Buefy);

new Vue({
  el: '#root',
  router,
  components: {
    'gr-header': header,
    'gr-footer': footer,
    'confirm-email': confirmEmail,
    'client-login': clientLogin,
  },
});
