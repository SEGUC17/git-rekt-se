import VueRouter from 'vue-router';
import About from '../components/pages/about.vue';
import SearchPage from '../components/visitor/search-page.vue';

const routes = [{
  path: '/about',
  component: About,
}, {
  path: '/visitor/search',
  component: SearchPage,
},
];

const router = new VueRouter({
  routes,
});

export default router;
