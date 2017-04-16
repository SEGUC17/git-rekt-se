import VueRouter from 'vue-router';
import Reset from '../components/business/reset.vue';
import Home from '../components/pages/Index/home.vue';


const routes = [{
  path: '/',
  component: Home,
},
{
  path: '/reset/:token',
  component: Reset,
},
];

const router = new VueRouter({
  routes,
  linkActiveClass: 'is-active',
});

export default router;
