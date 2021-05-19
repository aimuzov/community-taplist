<script>
	import Tap from '../Tap/index.svelte';

	function flipper(node) {
		window.setInterval(() => {
			node.classList.toggle('flipped');
		}, 8000);
	}

	export let list;
</script>

<div class="tap-list">
	{#each list as column}
		<div class="column">
			{#each column as [frontItem, backItem]}
				{#if backItem}
					<div class="card" use:flipper>
						<div class="card-face front">
							<Tap item={frontItem} />
						</div>
						<div class="card-face back">
							<Tap item={backItem} />
						</div>
					</div>
				{:else}
					<Tap item={frontItem} />
				{/if}
			{/each}
		</div>
	{/each}
</div>

<style lang="postcss">
	.tap-list {
		display: flex;
		width: 1920rem;
		height: 1080rem;
		background-color: #131111;
		overflow: hidden;
	}

	.column {
	}

	.card {
		position: relative;

		&:global(.flipped) {
			.card-face.front {
				opacity: 0;
			}
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
