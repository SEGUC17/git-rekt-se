import VueRouter from 'vue-router';
import About from '../components/pages/about.vue';
import Reset from '../components/business/reset.vue';

const routes = [{
  path: '/about',
  component: About,
},
{
  path: '/reset/:token',
  component: Reset,
}];

const router = new VueRouter({
  routes,
});

export default router;
