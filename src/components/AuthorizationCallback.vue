<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { exchangeCodeForToken } from '@/services/spotifyApi.js';

const router = useRouter();

const message = ref('Finishing Spotify authorization...');

function clearLoginData() {
    sessionStorage.removeItem('code_verifier');
    sessionStorage.removeItem('authentication_state');
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
        message.value = 'Something went wrong: ' + error.message;
    } finally {
        clearLoginData();
    }
});
</script>

<template>
    <p>{{ message }}</p>
    <p><RouterLink to="/">Go to Home</RouterLink></p>
</template>
