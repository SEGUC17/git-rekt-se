import VueRouter from 'vue-router';
import Reset from '../components/client/Reset.vue';
import Home from '../components/pages/Index/home.vue';

const routes = [
  {
    path: '/client/auth/reset/:token',
    component: Reset,
  },
  {
    path: '/',
    component: Home,
  },
];

const router = new VueRouter({
  routes,
  linkActiveClass: 'is-active',
});

export default router;
