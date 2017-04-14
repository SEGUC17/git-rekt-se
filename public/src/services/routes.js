import VueRouter from 'vue-router';
import About from '../components/pages/about.vue';
import ForgotPassword from '../components/business/forgotPassword.vue';

const routes = [{
  path: '/about',
  component: About,
},
{
  path: '/api/v1/business/forgot',
  component: ForgotPassword,
}];

const router = new VueRouter({
  routes,
});

export default router;
