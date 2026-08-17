import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore.js';
import Home from '@/components/Home.vue';
import Authorization from '@/components/Authorization.vue';
import AuthorizationCallback from '@/components/AuthorizationCallback.vue';
import AuthorizationLogout from '@/components/AuthorizationLogout.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: Home,
            meta: { requiresAuth: true },
        },
        {
            path: '/login',
            component: Authorization,
            meta: { guestOnly: true },
        },
        {
            path: '/authCallback',
            component: AuthorizationCallback,
            meta: { guestOnly: true },
        },
        {
            path: '/logout',
            component: AuthorizationLogout,
            meta: { requiresAuth: true },
        },
    ],
});

router.beforeEach((to) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.loggedIn) {
        return { path: '/login' };
    }

    if (to.meta.guestOnly && authStore.loggedIn) {
        return { path: '/' };
    }
});

export default router;
