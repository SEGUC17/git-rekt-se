import VueRouter from 'vue-router';
import About from '../components/pages/about.vue';
import verifiedBusinessSignup from '../components/Business/verifiedBusinessSignup.vue';

const routes = [{
  path: '/about',
  component: About,
}, {
  path: '/confirm/signup/:token',
  component: verifiedBusinessSignup,
}];

const router = new VueRouter({
  routes,
});

export default router;
