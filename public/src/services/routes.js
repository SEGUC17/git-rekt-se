import VueRouter from 'vue-router';
import About from '../components/pages/about.vue';
import Sample from '../components/sample.vue';
import Coupon from '../components/service/couponPage.vue';

const routes = [{
  path: '/about',
  component: About,
},
{
  path: '/sample',
  component: Sample,
},
{
  path: '/coupons',
  component: Coupon,
}];

const router = new VueRouter({
  routes,
});

export default router;
