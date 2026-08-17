<script setup>
    import { onMounted } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    onMounted(async () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('cachedList');

        await router.replace('/login');
    });
</script>

<template>
</template>
