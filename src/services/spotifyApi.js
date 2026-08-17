import { clientId, redirectUri } from '@/config/spotify';

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

    return response.access_token;
}

export async function getFollowedArtists(url = 'https://api.spotify.com/v1/me/following?type=artist&limit=50') {
    let accessToken = localStorage.getItem('access_token');

    const response = await fetch(url, {
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });

    const result = await response.json();

    return result;
}