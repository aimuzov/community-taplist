import { PUBLIC_JSONBIN_ITEMS_URL } from '$env/static/public';
import { ITEMS_PER_COLUMN, ITEMS_PER_LIST } from '$lib/constants.js';
import { JsonBin } from '$lib/json-bin.js';
import { json } from '@sveltejs/kit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPreparedList(number: number, items: any[]) {
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

export async function GET(event) {
	const response = await JsonBin.get();
	const itemsRaw = await response.json();
	const tvNumber = Number(event.params.slug);
	const data = { items: getPreparedList(tvNumber, itemsRaw) };

	return json(data);
}
