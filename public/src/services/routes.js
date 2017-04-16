import VueRouter from 'vue-router';
import Forgot from '../components/pages/client/Forgot.vue';
import Home from '../components/pages/Index/home.vue';

const routes = [{
  path: '/client/auth/forgot',
  component: Forgot,
},
{
  path: '/',
  component: Home,
},

];

const router = new VueRouter({
  routes,
  linkActiveClass: 'is-active',
});

export default router;
