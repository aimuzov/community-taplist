<script context="module">
	import { JSONBIN_SECRET, JSONBIN_ITEMS_URL } from '$lib/env';

	const ITEMS_PER_LIST = 12;
	const ITEMS_PER_COLUMN = 4;

	function getPreparedList(number, items) {
		const preparedItems = [];
		const startIndex = (number - 1) * ITEMS_PER_LIST;
		const endIndex = startIndex + ITEMS_PER_LIST;
		const itemsWithNumbers = items.map((item, index) => ({ ...item, number: index + 1 }));
		const itemsForListByNumber = itemsWithNumbers.slice(startIndex, endIndex);

		while (itemsForListByNumber.length > 0) {
			const piece = itemsForListByNumber.splice(-ITEMS_PER_COLUMN);

			preparedItems.unshift(piece.map((frontItem) => [frontItem]));
		}

		if (number === 2) {
			const lastItem = preparedItems[preparedItems.length - 1][3];

			if (lastItem) {
				lastItem[1] = itemsWithNumbers[24];
			}
		}

		return preparedItems;
	}

	export async function load({ page }) {
		const url = JSONBIN_ITEMS_URL ? JSONBIN_ITEMS_URL : 'http://localhost:3000/items.json';
		const response = await fetch(url, { headers: { 'secret-key': JSONBIN_SECRET } });
		const items = await response.json();
		const preparedList = getPreparedList(Number(page.params.number), items);

		return { props: { list: preparedList } };
	}
</script>

<script>
	import TapList from '$lib/TapList/index.svelte';

	export let list;
</script>

<main>
	<TapList {list} />
</main>

<style lang="postcss">
	main {
		font-family: 'Arsenal';
		font-size: 16rem;
		--webkit-font-smoothing: antialiased;
		user-select: none;
	}

	main :global(*) {
		box-sizing: border-box;
		outline: 0;
	}
</style>
