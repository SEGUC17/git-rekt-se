import VueRouter from 'vue-router';
import About from '../components/pages/about.vue';
import UnverifiedBusinessSignup from '../components/Business/UnverifiedSignup.vue';

const routes = [
  {
    path: '/about',
    component: About,
  },
  {
    path: '/business/signup',
    component: UnverifiedBusinessSignup,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
