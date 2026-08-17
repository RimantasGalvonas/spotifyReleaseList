<script setup>
    defineProps({
        messages: {
            type: Array,
            required: true,
        },
    });
</script>

<template>
    <details>
        <summary>{{ messages.at(-1) }}</summary>
        <div class="message-box">
            <p v-for="message in messages">{{ message }}</p>
        </div>
    </details>
</template>

<style scoped>
    details {
        font-size: 12px;
    }

    details summary {
        padding: 10px 0;
    }

    .message-box {
        background-color: black;
        padding: 10px;
        height: 100px;
        overflow-y: scroll;
    }
</style>
