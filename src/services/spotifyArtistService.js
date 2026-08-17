import { getArtistAlbums } from '@/services/spotifyApi.js';


export async function getAllArtistAlbums(artistId, forceRefresh = false) { // TODO: refactor, don't like this
    const albums = [];

    const followedArtists = JSON.parse(localStorage.getItem('followedArtists'));
    const artist = followedArtists.find(artist => artist.id === artistId);

    const cachedAlbums = artist.albums || [];

    if (cachedAlbums.length > 0 && !forceRefresh) {
        return cachedAlbums;
    }

    let nextUrl;

    do {
        const response = await getArtistAlbums(artistId, nextUrl);

        albums.push(...response.items);
        nextUrl = response.next;
    } while (nextUrl);

    artist.albums = albums;
    localStorage.setItem('followedArtists', JSON.stringify(followedArtists));

    return albums;
}
