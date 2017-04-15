import VueRouter from 'vue-router';
import About from '../components/pages/about.vue';
import Checkout from '../components/pages/checkout/checkout.vue';

const routes = [{
  path: '/about',
  component: About,
}, {
  path: '/service/:ser_id/book',
  component: Checkout,
}];

const router = new VueRouter({
  routes,
});

export default router;
