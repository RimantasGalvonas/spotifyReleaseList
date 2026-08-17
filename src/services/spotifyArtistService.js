import { getArtistAlbums } from '@/services/spotifyApi.js';


export async function getAllArtistAlbums(artist, forceRefresh = false) { // TODO: refactor, don't like this
    const followedArtists = JSON.parse(localStorage.getItem('followedArtists'));

    const cachedAlbums = artist.albums || [];

    if (cachedAlbums.length > 0 && !forceRefresh) {
        return cachedAlbums;
    }

    const albums = [];
    let nextUrl;

    do {
        const response = await getArtistAlbums(artist.id, nextUrl);

        albums.push(...response.items);
        nextUrl = response.next;
    } while (nextUrl);

    artist.albums = albums;
    localStorage.setItem('followedArtists', JSON.stringify(followedArtists));

    return albums;
}
