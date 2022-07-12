import { JSONBIN_ACCESS_KEY, JSONBIN_MASTER_KEY, JSONBIN_ITEMS_URL } from '$lib/env';

const mockUrl = 'http://localhost:3000/items.json';
const headers = {
	'X-Master-Key': JSONBIN_MASTER_KEY,
	'X-Access-Key': JSONBIN_ACCESS_KEY,
	'Content-Type': 'application/json'
};

export async function get() {
	const url = JSONBIN_ITEMS_URL ? JSONBIN_ITEMS_URL + '/latest' : mockUrl;
	const response = await fetch(url, { headers });
	const data = await response.json();
	const { record } = data;

	return record;
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
