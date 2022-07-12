<script context="module">
	import * as api from '$lib/api';

	export async function load() {
		const items = await api.get();

		return { props: { list: items } };
	}
</script>

<script>
	import Card from '$lib/Card.svelte';

	export let list;
</script>

<div class="root">
	<div class="inner">
		<div class="heading">Таплист</div>

		<div class="list">
			{#each list as item, index}
				<Card {item} {index} />
			{/each}
		</div>
	</div>
</div>

<style lang="postcss">
	.root {
		padding: 0 0 25px;

		& :global(*) {
			box-sizing: border-box;
			outline: 0;
		}
	}

	.inner {
	}

	.heading {
		color: #8d99ae;
		font-size: 48px;
		font-weight: 400;
		margin: 25px 0;
		text-align: center;
	}

	.list {
	}
</style>
