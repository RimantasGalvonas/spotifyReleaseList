<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAllFollowedArtists } from '@/services/spotifyUserService.js';
import { getAllArtistAlbums } from '@/services/spotifyArtistService.js';

const router = useRouter();
const followedArtists = ref([]);
const isLoading = ref(true);
const message = ref();

async function refreshFollowedArtists() {
    isLoading.value = true;
    message.value = 'Refreshing followed artists...';
    followedArtists.value = await getAllFollowedArtists(true);
    isLoading.value = false;
}

onMounted(async () => {
    if (!localStorage.getItem('access_token')) {
        await router.push('/auth');
    }

    message.value = 'Loading followed artists...';
    followedArtists.value = await getAllFollowedArtists();

    for (const [index, artist] of followedArtists.value.entries()) {
        message.value = `Loading albums for ${artist.name} (${index + 1}/${followedArtists.value.length})...`;

        await getAllArtistAlbums(artist.id);
    }

    isLoading.value = false;
});
</script>

<template>
    <div>Hello</div>
    <p>
        <button :disabled="isLoading" @click="refreshFollowedArtists()">
            {{ isLoading ? 'Loading...' : 'Refresh' }}
        </button>
    </p>
    <p>
        {{ message }}
    </p>
</template>

<style scoped></style>
