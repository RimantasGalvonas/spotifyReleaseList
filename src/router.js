import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue';
import Authorization from '@/components/Authorization.vue';
import AuthorizationCallback from '@/components/AuthorizationCallback.vue';

export default createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', component: Home },
        { path: '/auth', component: Authorization },
        { path: '/auth/callback', component: AuthorizationCallback },
    ],
});
