<script lang="ts">
	import TapItem from './tap-item.svelte';

	function flipper(node: HTMLDivElement) {
		const intervalId = window.setInterval(() => node.classList.toggle('flipped'), 8000);
		return { destroy: () => clearInterval(intervalId) };
	}

	export let list;
</script>

<div class="tap-list">
	{#each list as column}
		<div>
			{#each column as [frontItem, backItem]}
				{#if backItem}
					<div class="card" use:flipper>
						<div class="card-face front"><TapItem item={frontItem} /></div>
						<div class="card-face back"><TapItem item={backItem} /></div>
					</div>
				{:else}
					<TapItem item={frontItem} />
				{/if}
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

	.card:global(.flipped) {
		& .card-face.front {
			opacity: 0;
		}
	}

	.card-face {
		transition: 2000ms opacity;

		&.front {
			position: relative;
			z-index: 2;
		}

		&.back {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
</style>
