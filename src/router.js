import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Authorization from '@/components/Authorization.vue';
import AuthorizationCallback from '@/components/AuthorizationCallback.vue';
import AuthorizationLogout from '@/components/AuthorizationLogout.vue';

export default createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', component: Home },
        { path: '/login', component: Authorization },
        { path: '/authCallback', component: AuthorizationCallback },
        { path: '/logout', component: AuthorizationLogout },
    ],
});
