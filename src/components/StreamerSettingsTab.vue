<template>
	<div>
		{{ selectedStreamer }}
	</div>
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation.store';
import { storeToRefs } from 'pinia';

const navigationStore = useNavigationStore();
const { selectedStreamer } = storeToRefs(navigationStore);
</script>
