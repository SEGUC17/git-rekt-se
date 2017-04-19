import VueRouter from 'vue-router';
import Forgot from '../components/Client/Forgot.vue';
import Reset from '../components/Client/Reset.vue';
import Home from '../components/pages/Index/home.vue';
import SearchPage from '../components/pages/Search/search-page.vue';
import Checkout from '../components/pages/checkout/checkout.vue';
import clientLogin from '../components/Client/login.vue';
import clientLogout from '../components/Client/logout.vue';
import removeBus from '../components/Admin/removeBus.vue';
import clientSignUp from '../components/Client/signup.vue';
import loginSelect from '../components/pages/SharedLogin/loginSelect.vue';
import businessLogin from '../components/Business/login.vue';
import adminLogin from '../components/Admin/login.vue';

const routes = [{
  path: '/',
  component: Home,
}, {
  path: '/search',
  component: SearchPage,
}, {
  path: '/service/:ser_id/book',
  component: Checkout,
}, {
  path: '/client/login',
  component: clientLogin,
}, {
  path: '/client/logout',
  component: clientLogout,
}, {
  path: '/admin/removebusiness',
  component: removeBus,
}, {
  path: '/client/signup',
  component: clientSignUp,
}, {
  path: '/login',
  component: loginSelect,
}, {
  path: '/business/login',
  component: businessLogin,
}, {
  path: '/client/forgot',
  component: Forgot,
}, {
  path: '/client/reset/:token',
  component: Reset,
}, {
  path: '/admin/login',
  component: adminLogin,
}];

const router = new VueRouter({
  routes,
  linkActiveClass: 'is-active',
});

export default router;
