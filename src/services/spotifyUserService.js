import { getFollowedArtists } from '@/services/spotifyApi.js';

export async function getAllFollowedArtists() {
    const artists = [];

    let nextUrl;

    do {
        const response = await getFollowedArtists(nextUrl);

        artists.push(...response.artists.items);
        nextUrl = response.artists.next;
    } while (nextUrl);

    return artists;
}
