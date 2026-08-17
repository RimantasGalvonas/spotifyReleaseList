<script setup>
    import { useAuthStore } from '@/stores/authStore.js';
    import { computed } from 'vue';
    const authStore = useAuthStore();

    const greeting = computed(() => {
        return authStore.user ? `Hello, ${authStore.user.display_name}` : 'Hello';
    });
</script>

<template>
    <div id="header">
        <div id="header-content">
            <p id="greeting">{{ greeting }}</p>
            <p v-if="authStore.loggedIn" id="logout-link"><RouterLink to="/logout">Logout</RouterLink></p>
        </div>
    </div>
</template>

<style scoped>
</style>
