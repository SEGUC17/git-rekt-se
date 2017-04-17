import VueRouter from 'vue-router';
import Home from '../components/pages/Index/home.vue';
import clientLogin from '../components/Client/login.vue';
import clientLogout from '../components/Client/logout.vue';
import businessEditInfo from '../components/business/editInfo.vue';

const routes = [{
  path: '/',
  component: Home,
}, {
  path: '/client/login',
  component: clientLogin,
}, {
  path: '/client/logout',
  component: clientLogout,
}, {
  path: '/business/editinfo',
  component: businessEditInfo,
}];

const router = new VueRouter({
  routes,
  linkActiveClass: 'is-active',
});

export default router;
