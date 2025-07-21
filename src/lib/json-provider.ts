import { PRIVATE_JSON_PROVIDER, PRIVATE_CACHE } from '$env/static/private';
import { gistProviderCreator } from './gist';
import { jsonbinProviderCreator } from './json-bin';

export type Item = {
	cover: string;
	name: string;
	style: string;
	brewery: string;
	attrs: {
		alc: string;
		ibu: string;
		price04: string;
		price025: string;
	};
};

export type ItemData = {
	updated: number;
	items: Item[];
};

export function cacheCreate() {
	const cache: ItemData = {
		items: [],
		updated: 0
	};

	return {
		get: () => cache,
		isOutdated: () => PRIVATE_CACHE !== '1' || cache.updated === 0,

		update: (items: Item[]) => {
			cache.items = items;
			cache.updated = Date.now();
		}
	} as const;
}

const cache = cacheCreate();

const providerUnsafe =
	PRIVATE_JSON_PROVIDER === 'github'
		? gistProviderCreator(cache)
		: PRIVATE_JSON_PROVIDER === 'jsonbin'
			? jsonbinProviderCreator(cache)
			: null;

if (providerUnsafe === null) {
	throw new Error('AAA-AA-A!11');
}

export const provider = providerUnsafe;
