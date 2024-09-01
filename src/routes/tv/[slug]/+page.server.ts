export async function load(event) {
	const response = await event.fetch(`/tv/${event.params.slug}`);
	return response.json();
}
