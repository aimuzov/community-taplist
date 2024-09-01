import { JsonBin } from '$lib/json-bin.js';
import { json } from '@sveltejs/kit';

export async function GET() {
	const response = await JsonBin.get();
	const items = await response.json();
	const data = { items };

	return json(data);
}

export async function POST({ request }) {
	const response = await JsonBin.put(await request.text());
	const items = await response.json();
	const data = { items };

	return json(data);
}
