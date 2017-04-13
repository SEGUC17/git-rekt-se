import VueRouter from 'vue-router';
import About from '../components/pages/about.vue';
import Forgot from '../components/pages/client/Forgot.vue';

const routes = [{
  path: '/about',
  component: About,
},
{
  path: '/api/v1/client/auth/forgot',
  component: Forgot,
},

];

const router = new VueRouter({
  routes,
});

export default router;
