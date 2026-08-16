<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(async () => {
    if (!localStorage.getItem('access_token')) {
        await router.push('/auth');
    }
});
</script>

<template>
    <div>Hello</div>
</template>

<style scoped></style>
