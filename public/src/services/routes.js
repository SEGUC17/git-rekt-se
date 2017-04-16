import VueRouter from 'vue-router';
import ForgotPassword from '../components/business/forgotPassword.vue';
import Home from '../components/pages/Index/home.vue';


const routes = [{
  path: '/',
  component: Home,
},
{
  path: '/api/v1/business/forgot',
  component: ForgotPassword,
}];

const router = new VueRouter({
  routes,
  linkActiveClass: 'is-active',
});

export default router;
