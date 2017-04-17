import VueRouter from 'vue-router';
import Home from '../components/pages/Index/home.vue';
import servicePage from '../components/Business/service-page.vue';

const routes = [{
  path: '/',
  component: Home,
},
{
  path: '/service/:id',
  component: servicePage,
},
];

const router = new VueRouter({
  routes,
  linkActiveClass: 'is-active',
});

export default router;
