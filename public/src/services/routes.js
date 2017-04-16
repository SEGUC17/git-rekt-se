import VueRouter from 'vue-router';
import Home from '../components/pages/Index/home.vue';
import Checkout from '../components/pages/checkout/checkout.vue';

const routes = [{
  path: '/',
  component: Home,
}, {
  path: '/service/:ser_id/book',
  component: Checkout,
}];

const router = new VueRouter({
  routes,
  linkActiveClass: 'is-active',
});

export default router;
