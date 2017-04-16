import VueRouter from 'vue-router';
import Home from '../components/pages/Index/home.vue';
import Checkout from '../components/pages/checkout/checkout.vue';
import clientLogin from '../components/Client/login.vue';
import clientLogout from '../components/Client/logout.vue';

const routes = [{
  path: '/',
  component: Home,
}, {
  path: '/service/:ser_id/book',
  component: Checkout,
}, {
  path: '/client/login',
  component: clientLogin,
}, {
  path: '/client/logout',
  component: clientLogout,
}];

const router = new VueRouter({
  routes,
  linkActiveClass: 'is-active',
});

export default router;
