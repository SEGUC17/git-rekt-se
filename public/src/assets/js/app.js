import Vue from 'vue';
import VueRouter from 'vue-router';
import elementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en'
import Buefy from 'buefy'
import axios from 'axios';
import header from '../../components/shared/header.vue';
import footer from '../../components/shared/footer.vue';
import acceptbtn from '../../components/Admin/accept-btn.vue';
import rejectbtn from '../../components/Admin/reject-btn.vue';
import TopHero from '../../components/shared/gr-top-hero.vue';
import clientRemoveBtn from '../../components/Admin/remove-client-btn.vue';
import CategoryActions from '../../components/Admin/category-actions.vue';
import router from '../../services/routes.js';

/**
 * Allow axios to be accessed globaly.
 */
window.axios = axios;

/**
 * Register Vue Components to be accessed globaly.
 */
Vue.component('accept-btn', acceptbtn);
Vue.component('reject-btn', rejectbtn);
Vue.component('client-remove-btn', clientRemoveBtn);
Vue.component('category-actions-btns', CategoryActions);
Vue.component('gr-top-hero', TopHero);

/**
 * Register a Vue Filter.
 */
Vue.filter('appendRandom', (e) => {
  return `${e}${Math.random() * 10000000}`;
});

/**
 * Register Vue Plugins.
 */
Vue.use(VueRouter);
Vue.use(elementUI, {
    locale
});
Vue.use(Buefy, {
  defaultIconPack: 'fa',
});

/**
 * Instantiate a Vue Instance.
 */
new Vue({
  el: '#root',
  router,
  components: {
    'gr-header': header,
    'gr-footer': footer,
  }
});