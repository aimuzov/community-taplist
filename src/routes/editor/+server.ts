import { JsonBin } from '$lib/json-bin.js';
import { json } from '@sveltejs/kit';

export async function GET() {
	const response = await JsonBin.get();
	const data = await response.json();

	return json(data);
}

export async function POST({ request }) {
	const response = await JsonBin.put(await request.text());
	const data = await response.json();

	return json(data);
}
