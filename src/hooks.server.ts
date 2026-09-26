import { timingSafeEqual } from 'node:crypto';

import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

function isAuthorized(header: string | null) {
	// Fail closed: an unset secret must not turn into a guessable "undefined" password.
	if (!env.PRIVATE_EDITOR_SECRET || !header) return false;

	const expected = Buffer.from(`Basic ${Buffer.from(env.PRIVATE_EDITOR_SECRET).toString('base64')}`);
	const actual = Buffer.from(header);

	return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/editor') && !isAuthorized(event.request.headers.get('Authorization'))) {
		return new Response('Not authorized', {
			status: 401,
			headers: { 'WWW-Authenticate': 'Basic realm="Taplist editor", charset="UTF-8"' }
		});
	}

	return resolve(event);
};
