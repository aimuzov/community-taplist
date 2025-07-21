import { provider } from '$lib/json-provider';
import { json } from '@sveltejs/kit';

export async function GET() {
	const response = await provider.get();
	const data = await response.json();

	return json(data);
}

export async function POST({ request }) {
	const response = await provider.put(await request.text());
	const data = await response.json();

	return json(data);
}
