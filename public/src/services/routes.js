import VueRouter from 'vue-router';
import Home from '../components/pages/Index/home.vue';
import clientEditInfo from '../components/client/clientEditInfo.vue';
import clientLogin from '../components/Client/login.vue';
import clientLogout from '../components/Client/logout.vue';
import clientSignUp from '../components/Client/signup.vue';
import loginSelect from '../components/pages/SharedLogin/loginSelect.vue';
import businessLogin from '../components/Business/login.vue';


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
        path: '/client/signup',
        component: clientSignUp,
    }, {
        path: '/login',
        component: loginSelect,
    }, {
        path: '/business/login',
        component: businessLogin,
    },
    {
        path: '/:id/edit',
        component: clientEditInfo,
    },
];

const router = new VueRouter({
    routes,
    linkActiveClass: 'is-active',
});

export default router;