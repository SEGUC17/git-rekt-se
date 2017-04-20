import VueRouter from 'vue-router';
import Reset from '../components/Client/Reset.vue';
import Home from '../components/pages/Index/home.vue';
import Checkout from '../components/pages/checkout/checkout.vue';
import clientLogin from '../components/Client/login.vue';
import clientSignUp from '../components/Client/signup.vue';
import loginSelect from '../components/pages/SharedLogin/loginSelect.vue';
import businessLogin from '../components/Business/login.vue';
import serviceGallery from '../components/Service/gallery.vue';
import serviceGalleryEdit from '../components/Service/galleryEdit.vue';
import serviceGalleryDelete from '../components/Service/galleryDelete.vue';

const routes = [{
  path: '/',
  component: Home,
}, {
  path: '/service/:ser_id/book',
  component: Checkout,
}, {
  path: '/client/login',
  component: clientLogin,
}, {
  path: '/client/signup',
  component: clientSignUp,
}, {
  path: '/client/signup',
  component: clientSignUp,
}, {
  path: '/login',
  component: loginSelect,
}, {
  path: '/business/login',
  component: businessLogin,
}, {
  path: '/client/reset/:token',
  component: Reset,
}, {
  path: '/service/:id/gallery',
  component: serviceGallery,
}, {
  path: '/service/:ser_id/gallery/edit/im_id',
  component: serviceGalleryEdit,
}, {
  path: '/service/:ser_id/gallery/delete/im_id',
  component: serviceGalleryDelete,
}];

const router = new VueRouter({
  routes,
  linkActiveClass: 'is-active',
});

export default router;
