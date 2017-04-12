import VueRouter from 'vue-router';
import About from '../components/pages/about.vue';

const routes = [{
  path: '/about',
  component: About,
}];

const router = new VueRouter({
  routes,
});

export default router;
