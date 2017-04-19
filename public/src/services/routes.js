import VueRouter from 'vue-router';
import Home from '../components/pages/Index/home.vue';
import clientLogin from '../components/Client/login.vue';
import clientLogout from '../components/Client/logout.vue';
import businessGalleryDelete from '../components/Business/galleryDelete.vue';
import businessGalleryEdit from '../components/Business/galleryEdit.vue';
import businessGalleryAdd from '../components/Business/galleryAdd.vue';
import businessGallery from '../components/Business/businessGallery.vue';


const routes = [{
  path: '/',
  component: Home,
}, {
  path: '/client/login',
  component: clientLogin,
}, {
  path: '/client/logout',
  component: clientLogout,
}, {
  path: '/business/:id/gallery',
  component: businessGallery,
}, {
  path: '/business/:id/gallery/delete',
  component: businessGalleryDelete,
}, {
  path: '/business/:id/gallery/edit',
  component: businessGalleryEdit,
}, {
  path: '/business/:id/gallery/add',
  component: businessGalleryAdd,
}];

const router = new VueRouter({
  routes,
  linkActiveClass: 'is-active',
});

export default router;
