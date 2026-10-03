import { error, json } from '@sveltejs/kit';

import { itemsPut } from '$lib/server/store';
import { isItemList } from '$lib/types';

export async function POST({ request }) {
	// Kit would hide a 413 over BODY_SIZE_LIMIT behind a bare 500, so keep its status and text.
	const items = await request.json().catch((err) => {
		if (err instanceof SyntaxError) error(400, 'Invalid JSON body');
		if (typeof err?.status === 'number') error(err.status, err.message);
		throw err;
	});

	if (!isItemList(items)) {
		error(400, 'Expected a list of taps');
	}

	return json(await itemsPut(items));
}
