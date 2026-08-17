import { getFollowedArtists } from '@/services/spotifyApi.js';

export async function getAllFollowedArtists(forceRefresh = false) {
    const cachedArtists = JSON.parse(localStorage.getItem('followedArtists')) || [];

    if (cachedArtists.length > 0 && !forceRefresh) {
        return cachedArtists;
    }

    const artists = [];

    let nextUrl;

    do {
        const response = await getFollowedArtists(nextUrl);

        artists.push(...response.artists.items);
        nextUrl = response.artists.next;
    } while (nextUrl);

    localStorage.setItem('followedArtists', JSON.stringify(artists));

    return artists;
}
