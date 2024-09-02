import type { Handle } from '@sveltejs/kit';
import { PRIVATE_EDITOR_SECRET } from '$env/static/private';

export const handle: Handle = async ({ event, resolve }) => {
	const url = new URL(event.request.url);

	if (url.pathname.startsWith('/editor')) {
		const auth = event.request.headers.get('Authorization');

		if (auth !== `Basic ${btoa(PRIVATE_EDITOR_SECRET)}`) {
			return new Response('Not authorized', {
				status: 401,
				headers: { 'WWW-Authenticate': 'Basic realm="User Visible Realm", charset="UTF-8"' }
			});
		}
	}

	return resolve(event);
};
