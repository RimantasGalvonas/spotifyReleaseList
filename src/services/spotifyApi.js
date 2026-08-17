import { clientId, redirectUri } from '@/config/spotify';
import router from '@/router';

export async function getFollowedArtists(nextUrl) {
    let url = 'https://api.spotify.com/v1/me/following?type=artist&limit=50';

    if (nextUrl) {
        url = nextUrl;
    }

    return await makeAuthenticatedCall(url);
}

export async function getArtistAlbums(artistId, nextUrl) {
    let url = `https://api.spotify.com/v1/artists/${artistId}/albums?limit=10`;

    if (nextUrl) {
        url = nextUrl;
    }

    return await makeAuthenticatedCall(url);
}

export async function exchangeCodeForToken(code, codeVerifier) {
    const url = 'https://accounts.spotify.com/api/token';

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
        }),
    };

    const body = await fetch(url, payload);
    const response = await body.json();

    if (!body.ok) {
        throw new Error(
            response.error_description || 'Spotify authorization failed.',
        );
    }

    return response;
}

async function makeAuthenticatedCall(url, payload = {}, canRetry = true) {
    payload = addAuthorizationHeaderToPayload(payload);

    const response = await fetch(url, payload);

    const result = await response.json();

    if (response.status === 401 && canRetry) {
        await refreshAccessToken(url, payload);

        return await makeAuthenticatedCall(url, payload, false);
    }

    if (!response.ok) {
        throw new Error(result.error.message);
    }

    return result;
}

function addAuthorizationHeaderToPayload(payload = {}) {
    payload.headers = payload.headers || {};
    payload.headers.Authorization = 'Bearer ' + localStorage.getItem('access_token');

    return payload;
}

async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    const url = "https://accounts.spotify.com/api/token";

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientId,
        }),
    };

    const result = await fetch(url, payload);
    const response = await result.json();

    if (!result.ok) {
        if (response.error === 'invalid_grant') {
            await router.replace('/logout');

            throw new Error('Spotify authorization has expired.');
        }

        throw new Error(`Token refresh failed: ${response.error}`);
    }

    localStorage.setItem('access_token', response.access_token);
    if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
    }
}
