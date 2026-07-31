<template>
	<div class="counter" :class="dir" :style="{ '--num': count }" @transitionend="onTransitionEnd" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
	count: number;
}

const props = defineProps<Props>();
const dir = ref<'up' | 'down' | ''>('');

watch(
	() => props.count,
	(next, prev) => {
		dir.value = next > prev ? 'up' : next < prev ? 'down' : '';
	}
);

function onTransitionEnd(e: TransitionEvent) {
	if (e.propertyName === '--num') dir.value = '';
}
</script>

<style scoped>
@property --num {
	syntax: '<integer>';
	initial-value: 0;
	inherits: false;
}
@property --c {
	syntax: '<color>';
	initial-value: black;
	inherits: false;
}

.counter {
	--c: var(--color-text);
	color: var(--c);
	transition: --num 4s cubic-bezier(0.16, 1, 0.3, 1);
	counter-set: num var(--num);
	font-size: 13px;
	font-weight: 700;
}
.counter::after {
	content: counter(num);
}
.counter.up {
	animation: flash-up 4s ease-out;
}
.counter.down {
	animation: flash-down 4s ease-out;
}

@keyframes flash-up {
	0% {
		--c: var(--color-text);
	}
	12% {
		--c: #208b21;
	}
	100% {
		--c: var(--color-text);
	}
}
@keyframes flash-down {
	0% {
		--c: var(--color-text);
	}
	12% {
		--c: var(--color-red);
	}
	100% {
		--c: var(--color-text);
	}
}
</style>
