import { dev } from '$app/environment';
import mock from './json-bin-mock';
import { json } from '@sveltejs/kit';
import { PRIVATE_JSONBIN_ACCESS_KEY, PRIVATE_JSONBIN_MASTER_KEY } from '$env/static/private';
import { PUBLIC_JSONBIN_ITEMS_URL } from '$env/static/public';

const headers = {
	'X-Master-Key': PRIVATE_JSONBIN_MASTER_KEY,
	'X-Access-Key': PRIVATE_JSONBIN_ACCESS_KEY,
	'Content-Type': 'application/json'
};

export const JsonBin = {
	get: async () => {
		// const body = dev ? mock : await fetch(`${PUBLIC_JSONBIN_ITEMS_URL}/latest`, { headers }).then((r) => r.json());
		const body = await fetch(`${PUBLIC_JSONBIN_ITEMS_URL}/latest`, { headers }).then((r) => r.json());
		const data = body.record;

		return json(data);
	},

	put: async (reqBody: string) => {
		const response = await fetch(PUBLIC_JSONBIN_ITEMS_URL, { headers, method: 'PUT', body: reqBody });
		const body = await response.json();
		const data = body.record;

		return json(data);
	}
};
