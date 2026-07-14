<template>
    <button @click="counterStore.increment">Increment count from VueButton</button>
</template>


<script setup lang="ts">
import { useCounterStore } from '@/stores/counter';

const counterStore = useCounterStore()

</script>
