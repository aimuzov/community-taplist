import { ITEMS_PER_COLUMN, ITEMS_PER_LIST } from '$lib/constants.js';
import { provider, type Item } from '$lib/json-provider.js';
import { json } from '@sveltejs/kit';

function itemsConvert(number: number, itemsRaw: Item[]) {
	const indexStart = ITEMS_PER_LIST * (number - 1);
	const indexEnd = ITEMS_PER_LIST + indexStart;

	const items = [];
	const itemsAll = itemsRaw.map((item, index) => ({ ...item, number: index + 1 }));
	const itemsPaged = itemsAll.slice(indexStart, indexEnd);

	while (itemsPaged.length > 0) {
		const piece = itemsPaged.splice(-ITEMS_PER_COLUMN);
		items.unshift(piece.map((frontItem) => [frontItem]));
	}

	if (number === 2) {
		const lastItem = items[items.length - 1][3];

		if (lastItem) {
			lastItem[1] = itemsAll[24];
		}
	}

	return items;
}

export async function GET(event) {
	const response = await provider.get();
	const data = await response.json();
	const tvNumber = Number(event.params.slug);

	return json({
		updated: data.updated,
		items: itemsConvert(tvNumber, data.items)
	});
}
