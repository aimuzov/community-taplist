import { error } from '@sveltejs/kit';

import { env } from '$env/dynamic/public';
import { REFRESH_INTERVAL_DEFAULT, TV_COUNT } from '$lib/constants';
import { itemsGet } from '$lib/server/store';
import { tvColumns } from '$lib/tv';

export async function load({ params }) {
	const tv = Number(params.slug);

	if (!Number.isInteger(tv) || tv < 1 || tv > TV_COUNT) {
		error(404, 'Not found');
	}

	const { items } = await itemsGet();
	const intervalMs = Number(env.PUBLIC_DATA_UPDATE_INTERVAL);

	return {
		columns: tvColumns(tv, items),
		refreshSeconds: intervalMs > 0 ? Math.round(intervalMs / 1000) : REFRESH_INTERVAL_DEFAULT
	};
}
