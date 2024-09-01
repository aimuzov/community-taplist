export async function load(event) {
	const response = await event.fetch('/editor');
	const data = await response.json();

	return data;
}
