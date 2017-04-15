import VueRouter from 'vue-router';
import About from '../components/pages/about.vue';
import ClientSignUp from '../components/client/signup.vue';

const routes = [{
  path: '/about',
  component: About,
}, {
  path: '/client/signup',
  component: ClientSignUp,
}];

const router = new VueRouter({
  routes,
});

export default router;
