<template>
	<div class="card" aria-hidden="true">
		<div class="thumb-wrap">
			<SkeletonBlock width="200px" height="100px" radius="0" />
		</div>

		<div class="card-info">
			<div class="text-block">
				<SkeletonBlock height="15px" width="88%" />
				<SkeletonBlock height="14px" width="50%" />
			</div>

			<div class="meta-row">
				<SkeletonBlock height="13px" width="55px" />
				<SkeletonBlock height="13px" width="40px" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import SkeletonBlock from './SkeletonBlock.vue';
</script>

<style scoped>
.card {
	display: flex;
	gap: 10px;
	border-bottom: 1px solid var(--color-border);
	padding: 5px;
}

.card:last-child {
	border-bottom: none;
}

.thumb-wrap {
	flex-shrink: 0;
	width: 200px;
	height: 100px;
	overflow: hidden;
}

.card-info {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 10px;
	flex: 1;
}

.text-block {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.meta-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
</style>
