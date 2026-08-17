<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getAllFollowedArtists } from '@/services/spotifyUserService.js';
import { getAllArtistAlbums } from '@/services/spotifyArtistService.js';

const router = useRouter();
const followedArtists = ref([]);
const isLoading = ref(true);
const message = ref();
const albums = ref([]);

async function load(refresh = false) {
    isLoading.value = true;
    albums.value = [];

    try {
        message.value = 'Loading followed artists...';
        followedArtists.value = await getAllFollowedArtists(refresh);
    } catch (error) {
        message.value = 'Error loading followed artists: ' + error;

        isLoading.value = false;
        return false;
    }

    for (const [index, artist] of followedArtists.value.entries()) {
        message.value = `Loading albums for ${artist.name} (${index + 1}/${followedArtists.value.length})...`;

        try {
            let artistAlbums = await getAllArtistAlbums(artist, refresh);
            for (const album of artistAlbums) {
                album.artist = artist;
            }
            albums.value.push(...artistAlbums);
        } catch (error) {
            message.value = `Error loading albums for ${artist.name}: ` + error;
            break;
        }
    }

    albums.value.sort((a, b) => {
        const dateA = Date.parse(a.release_date);
        const dateB = Date.parse(b.release_date);

        return dateB - dateA;
    });

    isLoading.value = false;
}

onMounted(async () => {
    if (!localStorage.getItem('access_token')) {
        await router.push('/auth');

        return;
    }

    await load();

    // TODO: throw out all that artist caching logic. Just cache this list.
});
</script>

<template>
    <div>Hello</div>
    <p>
        <button :disabled="isLoading" @click="load(true)">
            {{ isLoading ? 'Loading...' : 'Refresh' }}
        </button>
    </p>
    <p>
        {{ message }}
    </p>
    <table>
        <tr v-for="album in albums" :key="album.id">
            <td><img :src="album.images[2].url"/></td>
            <td>{{ album.artist.name }}</td>
            <td>{{ album.name }}</td>
            <td>{{ album.release_date }}</td>
            <td>{{ album.album_type }}</td>
        </tr>
    </table>
</template>

<style scoped></style>
