<script setup>
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { getAllFollowedArtists, getAllArtistAlbums } from '@/services/spotifyService.js';
    import StatusMessages from '@/components/StatusMessages.vue';

    const router = useRouter();
    const followedArtists = ref([]);
    const isLoading = ref(true);
    const messages = ref([]);
    const albums = ref([]);

    async function load() {
        isLoading.value = true;
        albums.value = [];

        try {
            messages.value.push('Loading followed artists...');
            followedArtists.value = await getAllFollowedArtists();
        } catch (error) {
            messages.value.push('Error loading followed artists: ' + error);

            isLoading.value = false;
            return false;
        }

        for (const [index, artist] of followedArtists.value.entries()) {
            messages.value.push(`Loading albums for ${artist.name} (${index + 1}/${followedArtists.value.length})...`);

            try {
                let artistAlbums = await getAllArtistAlbums(artist);
                for (const album of artistAlbums) {
                    album.artist = artist;
                }
                albums.value.push(...artistAlbums);
            } catch (error) {
                messages.value.push(`Error loading albums for ${artist.name}: ` + error);
                break;
            }
        }

        albums.value.sort((a, b) => {
            const dateA = Date.parse(a.release_date);
            const dateB = Date.parse(b.release_date);

            return dateB - dateA;
        });

        localStorage.setItem('cachedList', JSON.stringify(albums.value));

        isLoading.value = false;
    }

    onMounted(async () => {
        if (!localStorage.getItem('access_token')) {
            await router.push('/login');

            return;
        }

        let cachedAlbums = JSON.parse(localStorage.getItem('cachedList'));

        if (cachedAlbums?.length > 0) {
            albums.value = cachedAlbums;
        } else {
            await load();
        }

        isLoading.value = false;
    });
</script>

<template>
    <p>
        <button :disabled="isLoading" @click="load(true)">
            {{ isLoading ? 'Loading...' : 'Refresh' }}
        </button>
    </p>
    <p>
        <StatusMessages :messages="messages"></StatusMessages>
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
