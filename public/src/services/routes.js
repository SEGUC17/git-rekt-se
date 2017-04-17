import VueRouter from 'vue-router';
import Reset from '../components/client/Reset.vue';
import Home from '../components/pages/Index/home.vue';
import clientLogin from '../components/Client/login.vue';
import clientLogout from '../components/Client/logout.vue';
import loginSelect from '../components/pages/SharedLogin/loginSelect.vue';
import businessLogin from '../components/Business/login.vue';

const routes = [
  {
    path: '/client/auth/reset/:token',
    component: Reset,
  },
  {
    path: '/',
    component: Home,
  },
  {
    path: '/client/login',
    component: clientLogin,
  }, {
    path: '/client/logout',
    component: clientLogout,
  }, {
    path: '/login',
    component: loginSelect,
  }, {
    path: '/business/login',
    component: businessLogin,
  }];

const router = new VueRouter({
  routes,
  linkActiveClass: 'is-active',
});

export default router;
