import * as SpotifyApi from '@/services/spotifyApi.js';

export async function getAllFollowedArtists() {
    const artists = [];

    let nextUrl;

    do {
        const response = await SpotifyApi.getFollowedArtists(nextUrl);

        artists.push(...response.artists.items);
        nextUrl = response.artists.next;
    } while (nextUrl);

    return artists;
}

export async function getAllArtistAlbums(artist) {
    const albums = [];
    let nextUrl;

    do {
        const response = await SpotifyApi.getArtistAlbums(artist.id, nextUrl);

        albums.push(...response.items);
        nextUrl = response.next;
    } while (nextUrl);

    return albums;
}

export async function getCurrentUser() {
    return await SpotifyApi.getCurrentUser();
}
