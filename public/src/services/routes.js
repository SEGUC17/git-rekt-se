import VueRouter from 'vue-router';
import About from '../components/pages/about.vue';
import clientLogin from '../components/Client/login.vue';

const routes = [{
  path: '/about',
  component: About,
}, {
  path: 'client/auth/login',
  component: clientLogin,
}];

const router = new VueRouter({
  routes,
});

export default router;
