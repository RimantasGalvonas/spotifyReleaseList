import { defineStore } from 'pinia';

export const useAuthStore = defineStore('authStore', {
    state: () => ({
        loggedIn: false,
        user: null,
        accessToken: null,
        refreshToken: null,
    }),

    actions: {
        setTokens({ access_token, refresh_token }) {
            this.accessToken = access_token;

            if (refresh_token) {
                this.refreshToken = refresh_token;
            }
        },

        setUser(user) {
            this.user = user;
            this.loggedIn = true;
        },

        logout() {
            this.user = null;
            this.accessToken = null;
            this.refreshToken = null;
            this.loggedIn = false;
        },
    },

    persist: true,
});
