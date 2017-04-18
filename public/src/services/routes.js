import VueRouter from 'vue-router';
import ForgotPassword from '../components/business/forgotPassword.vue';
import Home from '../components/pages/Index/home.vue';
import clientLogin from '../components/Client/login.vue';
import clientLogout from '../components/Client/logout.vue';
import clientSignUp from '../components/Client/signup.vue';
import loginSelect from '../components/pages/SharedLogin/loginSelect.vue';
// import businessLogin from '../components/Business/login.vue';


const routes = [{
  path: '/',
  component: Home,
},
{
  path: '/api/v1/business/forgot',
  component: ForgotPassword,
}, {
  path: '/client/login',
  component: clientLogin,
}, {
  path: '/client/logout',
  component: clientLogout,
}, {
  path: '/client/signup',
  component: clientSignUp,
}, {
  path: '/login',
  component: loginSelect,
},
];

const router = new VueRouter({
  routes,
  linkActiveClass: 'is-active',
});

export default router;
