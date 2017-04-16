import VueRouter from 'vue-router';
import Home from '../components/pages/Index/home.vue';
import clientLogin from '../components/Client/login.vue';
import clientLogout from '../components/Client/logout.vue';
import adminBusiness from '../components/admin/unverifiedBusinessPage.vue';


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
  path: '/admin/business',
  component: adminBusiness,
}];

const router = new VueRouter({
  routes,
  linkActiveClass: 'is-active',
});

export default router;
