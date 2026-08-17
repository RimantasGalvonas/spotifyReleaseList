<script setup>
    import { onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useAuthStore } from '@/stores/authStore.js';

    const router = useRouter();
    const authStore = useAuthStore();

    onMounted(async () => {
        localStorage.removeItem('cachedList');

        authStore.logout();

        await router.replace('/login');
    });
</script>

<template>
</template>
