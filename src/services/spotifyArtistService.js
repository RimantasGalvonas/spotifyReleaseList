import { getArtistAlbums } from '@/services/spotifyApi.js';


export async function getAllArtistAlbums(artist) {
    const albums = [];
    let nextUrl;

    do {
        const response = await getArtistAlbums(artist.id, nextUrl);

        albums.push(...response.items);
        nextUrl = response.next;
    } while (nextUrl);

    return albums;
}
