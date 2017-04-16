import VueRouter from 'vue-router';
import Home from '../components/pages/Index/home.vue';
import SearchPage from '../components/visitor/search-page.vue';

const routes = [{
  path: '/',
  component: Home,
}, {
  path: '/visitor/search',
  component: SearchPage,
}];

const router = new VueRouter({
  routes,
  linkActiveClass: 'is-active',
});

export default router;
