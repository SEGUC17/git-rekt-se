import VueRouter from 'vue-router';
import UnverifiedBusinessSignup from '../components/Business/UnverifiedSignup.vue';
import Home from '../components/pages/Index/home.vue';


const routes = [{
  path: '/',
  component: Home,
},
{
  path: '/business/unverified/signup',
  component: UnverifiedBusinessSignup,
},
];

const router = new VueRouter({
  routes,
  linkActiveClass: 'is-active',
});

export default router;
