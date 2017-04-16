import VueRouter from 'vue-router';
import About from '../components/pages/about.vue';
import clientLogin from '../components/Client/login.vue';
import clientLogout from '../components/Client/logout.vue';

const routes = [{
  path: '/about',
  component: About,
}, {
  path: '/client/login',
  component: clientLogin,
}, {
  path: '/client/logout',
  component: clientLogout,
}];

const router = new VueRouter({
  routes,
});

export default router;
