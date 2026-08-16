<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { clientId, redirectUri } from '@/config/spotify';

const router = useRouter();

const message = ref('Finishing Spotify authorization...');

function clearLoginData() {
    sessionStorage.removeItem('code_verifier');
    sessionStorage.removeItem('authentication_state');
}

async function exchangeCodeForToken(code, codeVerifier) {
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

onMounted(async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');
        const state = params.get('state');
        const savedState = sessionStorage.getItem('authentication_state');

        if (!state || !savedState || state !== savedState) {
            throw new Error('State mismatch, possible CSRF.');
        }

        if (error) {
            throw new Error(error);
        }

        if (!code) {
            throw new Error('No authorization code was returned.');
        }

        const codeVerifier = sessionStorage.getItem('code_verifier');

        if (!codeVerifier) {
            throw new Error('Code verifier is missing. Please start again.');
        }

        const accessToken = await exchangeCodeForToken(code, codeVerifier);

        localStorage.setItem('access_token', accessToken);

        message.value = 'Authorization successful!';

        await router.replace('/');
    } catch (error) {
        message.value = error.message || 'Something went wrong.';
    } finally {
        clearLoginData();
    }
});
</script>

<template>
    <p>{{ message }}</p>
</template>
