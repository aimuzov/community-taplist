import { error, json } from '@sveltejs/kit';

import { itemsPut } from '$lib/server/store';
import { isItemList } from '$lib/types';

export async function POST({ request }) {
	const items = await request.json().catch(() => null);

	if (!isItemList(items)) {
		error(400, 'Expected a list of taps');
	}

	return json(await itemsPut(items));
}
