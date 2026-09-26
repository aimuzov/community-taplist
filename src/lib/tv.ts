import { EXTRA_ITEM_INDEX, ITEMS_PER_COLUMN, ITEMS_PER_LIST, TV_COUNT } from './constants';
import type { Item } from './types';

export type TapItem = Item & { number: number };

// A card shows its primary tap and optionally a second one that alternates with it.
export type TapCard = [TapItem] | [TapItem, TapItem];
export type TapColumn = TapCard[];

export function tvColumns(tv: number, items: Item[]): TapColumn[] {
	const numbered = items.map((item, index) => ({ ...item, number: index + 1 }));
	const start = ITEMS_PER_LIST * (tv - 1);
	const cards: TapCard[] = numbered.slice(start, start + ITEMS_PER_LIST).map((item) => [item]);

	const extra = numbered[EXTRA_ITEM_INDEX];

	if (tv === TV_COUNT && extra && cards.length >= ITEMS_PER_COLUMN) {
		cards[cards.length - 1] = [cards[cards.length - 1][0], extra];
	}

	// Filled from the end, so a short page leaves the gap in the first column.
	const columns: TapColumn[] = [];

	for (let end = cards.length; end > 0; end -= ITEMS_PER_COLUMN) {
		columns.unshift(cards.slice(Math.max(0, end - ITEMS_PER_COLUMN), end));
	}

	return columns;
}
