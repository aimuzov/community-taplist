import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

import { dev } from '$app/environment';
import { json } from '@sveltejs/kit';
import mock from './json-bin-mock';
import type { cacheCreate, Item } from './json-provider';

const headers = {
	'X-Master-Key': env.PRIVATE_JSONBIN_MASTER_KEY ?? '',
	'X-Access-Key': env.PRIVATE_JSONBIN_ACCESS_KEY ?? '',
	'Content-Type': 'application/json'
};

export const jsonbinProviderCreator = (cache: ReturnType<typeof cacheCreate>) => ({
	get: async () => {
		if (cache.isOutdated()) {
			const body = (
				dev ? mock : await fetch(`${publicEnv.PUBLIC_JSONBIN_ITEMS_URL}/latest`, { headers }).then((r) => r.json())
			) as { record: Item[] };

			cache.update(body.record);
		}

		return json(cache.get());
	},

	put: async (reqBody: string) => {
		const body = dev
			? { record: JSON.parse(reqBody) }
			: await fetch(publicEnv.PUBLIC_JSONBIN_ITEMS_URL ?? '', { headers, method: 'PUT', body: reqBody }).then((r) =>
					r.json()
				);

		cache.update(body.record);

		return json(cache.get());
	}
});
