import VueRouter from 'vue-router';
import Home from '../components/pages/Index/home.vue';
import clientLogin from '../components/Client/login.vue';
import clientLogout from '../components/Client/logout.vue';
import businessLogin from '../components/Business/login.vue';
import businessLogout from '../components/Business/logout.vue';


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
  path: '/business/login',
  component: businessLogin,
}, {
  path: '/business/logout',
  component: businessLogout,
}];

const router = new VueRouter({
  routes,
  linkActiveClass: 'is-active',
});

export default router;
