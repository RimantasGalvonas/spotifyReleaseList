<script setup>
    import { ref } from 'vue';
    import { clientId, redirectUri, scope } from '@/config/spotify';

    const isLoading = ref(false);

    function generateRandomString(length) {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));

        return values.reduce((acc, x) => acc + possible[x % possible.length], '');
    }

    async function sha256(plain) {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return window.crypto.subtle.digest('SHA-256', data);
    }

    function base64encode(input) {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }

    async function redirectForAuthorization() {
        if (isLoading.value) {
            return;
        }

        isLoading.value = true;

        const codeVerifier = generateRandomString(64);
        const hashed = await sha256(codeVerifier);
        const codeChallenge = base64encode(hashed);
        const state = generateRandomString(16);
        const authUrl = new URL('https://accounts.spotify.com/authorize');

        window.sessionStorage.setItem('authentication_state', state);
        window.sessionStorage.setItem('code_verifier', codeVerifier);

        const params = {
            response_type: 'code',
            client_id: clientId,
            state: state,
            scope,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: redirectUri,
        };

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    }
</script>

<template>
    <button :disabled="isLoading" @click="redirectForAuthorization">
        {{ isLoading ? 'Connecting...' : 'Connect to Spotify' }}
    </button>
</template>
