import VueRouter from 'vue-router';
import About from '../components/pages/about.vue';
import Reset from '../components/client/Reset.vue';

const routes = [
  {
    path: '/about',
    component: About,
  },
  {
    path: '/client/auth/reset/:token',
    component: Reset,
  },

];

const router = new VueRouter({
  routes,
});

export default router;
