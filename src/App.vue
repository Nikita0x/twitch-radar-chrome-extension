<template>
    <div>
        <h1 style="color: red;">Hello World. Counter is: {{ count }}</h1>
        <VueButton />
    </div>
</template>

<script setup lang="ts">
import VueButton from './components/VueButton.vue';

import { useCounterStore } from '@/stores/counter';
import { storeToRefs } from 'pinia';

const counterStore = useCounterStore()
const { count } = storeToRefs(counterStore)

</script>
