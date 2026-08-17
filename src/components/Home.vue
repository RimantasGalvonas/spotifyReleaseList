<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAllFollowedArtists } from '@/services/spotifyUserService.js';

const router = useRouter();
const followedArtists = ref([]);
const isLoading = ref(true);

async function refreshFollowedArtists() {
    isLoading.value = true;
    followedArtists.value = await getAllFollowedArtists(true);
    isLoading.value = false;
}

onMounted(async () => {
    if (!localStorage.getItem('access_token')) {
        await router.push('/auth');
    }

    followedArtists.value = await getAllFollowedArtists();
    isLoading.value = false;
});
</script>

<template>
    <div>Hello</div>
    <p>
        <button :disabled="isLoading" @click="refreshFollowedArtists()">
            {{ isLoading ? 'Loading artists...' : 'Refresh followed artists'}}
        </button>
    </p>
    <ul>
        <li v-for="followedArtist in followedArtists" :key="followedArtist.id">
            {{ followedArtist.name }}
        </li>
    </ul>
</template>

<style scoped></style>
