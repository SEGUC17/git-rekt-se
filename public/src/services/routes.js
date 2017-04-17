import VueRouter from 'vue-router';
import Home from '../components/pages/Index/home.vue';
import clientEditInfo from '../components/client/clientEditInfo.vue';

const routes = [{
    path: '/',
    component: Home,
}, {
    path: '/:id/edit',
    component: clientEditInfo,
}];

const router = new VueRouter({
    routes,
    linkActiveClass: 'is-active',
});

export default router;