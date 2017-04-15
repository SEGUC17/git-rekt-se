import VueRouter from 'vue-router';
import About from '../components/pages/about.vue';
import confirmEmail from '../components/Client/confirmEmail.vue';

const routes = [{
  path: '/about',
  component: About,
}, {
  path: '/client/confirm/:token',
  component: confirmEmail,
}];

const router = new VueRouter({
  routes,
});

export default router;
