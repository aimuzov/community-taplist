import { dev } from '$app/environment';
import mock from './json-bin-mock';
import { json } from '@sveltejs/kit';
import { PRIVATE_CACHE, PRIVATE_JSONBIN_ACCESS_KEY, PRIVATE_JSONBIN_MASTER_KEY } from '$env/static/private';
import { PUBLIC_JSONBIN_ITEMS_URL } from '$env/static/public';

const headers = {
	'X-Master-Key': PRIVATE_JSONBIN_MASTER_KEY,
	'X-Access-Key': PRIVATE_JSONBIN_ACCESS_KEY,
	'Content-Type': 'application/json'
};

export type JsonBinItem = {
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

export type JsonBinItemData = {
	updated: number;
	items: JsonBinItem[];
};

function cacheCreate() {
	const cache: JsonBinItemData = {
		items: [],
		updated: 0
	};

	return {
		get: () => cache,
		isOutdated: () => PRIVATE_CACHE !== '1' || cache.updated === 0,

		update: (items: JsonBinItem[]) => {
			cache.items = items;
			cache.updated = Date.now();
		}
	} as const;
}

const cache = cacheCreate();

export const JsonBin = {
	get: async () => {
		if (cache.isOutdated()) {
			const body = (
				dev ? mock : await fetch(`${PUBLIC_JSONBIN_ITEMS_URL}/latest`, { headers }).then((r) => r.json())
			) as { record: JsonBinItem[] };

			cache.update(body.record);
		}

		return json(cache.get());
	},

	put: async (reqBody: string) => {
		const body = dev
			? { record: JSON.parse(reqBody) }
			: await fetch(PUBLIC_JSONBIN_ITEMS_URL, { headers, method: 'PUT', body: reqBody }).then((r) => r.json());

		cache.update(body.record);

		return json(cache.get());
	}
};
