import VueRouter from 'vue-router';
import UnverifiedBusinessSignup from '../components/Business/UnverifiedSignup.vue';
import Forgot from '../components/Client/Forgot.vue';
import Reset from '../components/Client/Reset.vue';
import reset from '../components/business/reset.vue';
import Home from '../components/pages/Index/home.vue';
import clientEditInfo from '../components/Client/clientEditInfo.vue';
import SearchPage from '../components/pages/Search/search-page.vue';
import Checkout from '../components/pages/checkout/checkout.vue';
import clientLogin from '../components/Client/login.vue';
import verifiedBusinessSignup from '../components/Business/verifiedBusinessSignup.vue';
import adminBusiness from '../components/Admin/unverifiedBusinessPage.vue';
import confirmEmail from '../components/Client/confirmEmail.vue';
import clientSignUp from '../components/Client/signup.vue';
import loginSelect from '../components/pages/SharedLogin/loginSelect.vue';
import businessLogin from '../components/Business/login.vue';
import categoryCRUD from '../components/Admin/editCategory.vue';
import removeClient from '../components/Admin/removeClient.vue';
import adminLogin from '../components/Admin/login.vue';
import adminDashboard from '../components/Admin/dashboard/dashboard.vue';

const routes = [{
  path: '/',
  component: Home,
},
{
  path: '/client/reset/:token',
  component: Reset,
},
{
  path: '/business/apply',
  component: UnverifiedBusinessSignup,
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
  path: '/confirm/signup/:token',
  component: verifiedBusinessSignup,
}, {
  path: '/client/signup',
  component: clientSignUp,
}, {
  path: '/admin/business',
  component: adminBusiness,
}, {
  path: '/client/confirm/:token',
  component: confirmEmail,
}, {
  path: '/login',
  component: loginSelect,
}, {
  path: '/business/login',
  component: businessLogin,
},
{
  path: '/client/edit',
  component: clientEditInfo,
},
{
  path: '/client/forgot',
  component: Forgot,
}, {
  path: '/client/reset/:token',
  component: Reset,
}, {
  path: '/admin/login',
  component: adminLogin,
}, {
  path: '/admin/dashboard',
  component: adminDashboard,
  children: [{
    path: 'confirm',
    component: adminBusiness,
  }, {
    path: 'client/remove',
    component: removeClient,
  }, {
    path: 'categories/edit',
    component: categoryCRUD,
  }],
}, {
  path: '/reset/:token',
  component: reset,
},
];

const router = new VueRouter({
  routes,
  linkActiveClass: 'is-active',
});

export default router;
