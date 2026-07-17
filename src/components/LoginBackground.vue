<template>
    <div class="login-screen">
        <div class="background">
            <div v-for="i in 18" :key="i" class="circle" :style="{
                '--size': `${60 + Math.random() * 180}px`,
                '--x': `${Math.random() * 100}%`,
                '--y': `${Math.random() * 100}%`,
                '--delay': `${Math.random() * 6}s`,
                '--duration': `${8 + Math.random() * 6}s`,
            }" />
        </div>

        <div class="content">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.login-screen {
    position: relative;

    width: 100%;
    min-height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;

    overflow: hidden;

    background: #0d0d10;
}

.background {
    position: absolute;
    inset: 0;
}

.circle {
    position: absolute;

    left: var(--x);
    top: var(--y);

    width: var(--size);
    height: var(--size);

    border-radius: 50%;

    background: radial-gradient(circle,
            rgba(145, 70, 255, .35),
            rgba(145, 70, 255, .08),
            transparent);

    filter: blur(40px);

    animation:
        move var(--duration) ease-in-out infinite,
        pulse 4s ease-in-out infinite;

    animation-delay: var(--delay);
}

.content {
    z-index: 5;

}

@keyframes move {

    0% {
        transform: translate(0, 0);
    }

    25% {
        transform: translate(40px, -30px);
    }

    50% {
        transform: translate(-20px, 40px);
    }

    75% {
        transform: translate(20px, 20px);
    }

    100% {
        transform: translate(0, 0);
    }

}

@keyframes pulse {

    0%,
    100% {
        opacity: .35;
        scale: 1;
    }

    50% {
        opacity: 1;
        scale: 1.2;
    }

}
</style>