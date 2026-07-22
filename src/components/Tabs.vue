<template>
	<div class="tabs">
		<div class="tab-buttons">
			<button
				v-for="tab in tabs"
				:key="tab.id"
				:class="['tab-button', { active: activeTab === tab.id }]"
				@click="selectTab(tab.id)"
			>
				{{ tab.label }}
			</button>
		</div>

		<div class="tab-content">
			<template v-for="tab in tabs" :key="tab.id">
				<div v-if="activeTab === tab.id" class="tab-panel">
					<slot :name="tab.id" />
				</div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface TabItem {
	id: string;
	label: string;
}

const props = defineProps<{
	tabs: TabItem[];
	modelValue?: string;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void;
}>();

const activeTab = ref(props.modelValue || props.tabs[0]?.id || '');

watch(
	() => props.modelValue,
	(value) => {
		if (value) {
			activeTab.value = value;
		}
	}
);

function selectTab(tabId: string) {
	activeTab.value = tabId;
	emit('update:modelValue', tabId);
}
</script>

<style scoped>
.tabs {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.tab-buttons {
	display: flex;
	gap: 6px;
}

.tab-button {
	flex: 1;
	padding: 8px 10px;
	border: 1px solid var(--color-border-tabs);
	border-radius: 8px;
	background: var(--color-bg-tertiary);
	color: var(--color-text-notif-toggle);
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s ease;
}

.tab-button:hover {
	background: var(--color-bg-hover);
}

.tab-button.active {
	background: var(--color-accent);
	color: white;
	border-color: var(--color-accent);
}

.tab-content {
	min-height: 180px;
}

.tab-panel {
	animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(3px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
