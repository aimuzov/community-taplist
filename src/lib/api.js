import { JSONBIN_SECRET, JSONBIN_ITEMS_URL } from '$lib/env';

const mockUrl = 'http://localhost:3000/items.json';
const headers = { 'secret-key': JSONBIN_SECRET, 'Content-Type': 'application/json' };

export async function get() {
	const url = JSONBIN_ITEMS_URL ? JSONBIN_ITEMS_URL + '/latest' : mockUrl;
	const response = await fetch(url, { headers });
	const items = await response.json();

	return items;
}

export async function update(data) {
	const body = JSON.stringify(data);
	const url = JSONBIN_ITEMS_URL ? JSONBIN_ITEMS_URL : mockUrl;
	const response = await fetch(url, {
		headers,
		method: 'PUT',
		body
	});
	const result = await response.json();
	const updatedData = result.data;

	return updatedData;
}
