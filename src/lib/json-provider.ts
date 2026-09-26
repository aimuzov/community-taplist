import { env } from '$env/dynamic/private';
import { building } from '$app/environment';
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
		isOutdated: () => env.PRIVATE_CACHE !== '1' || cache.updated === 0,

		update: (items: Item[]) => {
			cache.items = items;
			cache.updated = Date.now();
		}
	} as const;
}

const cache = cacheCreate();

const providerUnsafe =
	env.PRIVATE_JSON_PROVIDER === 'github'
		? gistProviderCreator(cache)
		: env.PRIVATE_JSON_PROVIDER === 'jsonbin'
			? jsonbinProviderCreator(cache)
			: null;

// При сборке env пуст (он приходит только в рантайме), а модуль всё равно грузится для анализа роутов.
if (providerUnsafe === null && !building) {
	throw new Error('AAA-AA-A!11');
}

export const provider = providerUnsafe as NonNullable<typeof providerUnsafe>;
