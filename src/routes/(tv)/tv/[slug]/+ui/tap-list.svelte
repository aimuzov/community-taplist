<script lang="ts">
	import type { TapColumn } from '$lib/tv';
	import TapItem from './tap-item.svelte';

	export let columns: TapColumn[];
</script>

<div class="tap-list">
	{#each columns as column}
		<div>
			{#each column as [itemPrimary, itemSecondary]}
				<div class="card">
					<TapItem item={itemPrimary} />

					{#if itemSecondary}
						<div class="secondary"><TapItem item={itemSecondary} /></div>
					{/if}
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.tap-list {
		display: flex;
		width: 1920rem;
		height: 1080rem;
		background-color: #131111;
		overflow: hidden;
	}

	.card {
		position: relative;
	}

	.secondary {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		animation: shuffle;
		animation-duration: 12s;
		animation-iteration-count: infinite;
	}

	/* prettier-ignore */
	@keyframes shuffle {
		0%		{ opacity: 0 }
		20%		{ opacity: 0 }
		40%		{ opacity: 1 }
		80%		{ opacity: 1 }
		100%	{ opacity: 0 }
	}
</style>
