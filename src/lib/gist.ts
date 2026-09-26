import { json } from '@sveltejs/kit';
import { Octokit } from '@octokit/core';

import { env } from '$env/dynamic/private';

import type { cacheCreate } from './json-provider';

const octokit = new Octokit({ auth: env.PRIVATE_GITHUB_API_TOKEN });
const headers = { 'X-GitHub-Api-Version': '2022-11-28' };

export const gistProviderCreator = (cache: ReturnType<typeof cacheCreate>) => ({
	get: async () => {
		if (cache.isOutdated()) {
			const taplist_url = await octokit
				.request('GET /gists/{gist_id}', {
					gist_id: env.PRIVATE_GITHUB_GIST_ID,
					headers
				})
				.then((body) => body.data.files?.[env.PRIVATE_GITHUB_GIST_FILENAME]?.raw_url);

			if (!taplist_url) {
				throw new Error('Taplist url not found');
			}

			const body = await fetch(taplist_url).then((r) => r.json());

			cache.update(body.record);
		}

		return json(cache.get());
	},

	put: async (reqBody: string) => {
		const record = JSON.parse(reqBody);

		await octokit.request('PATCH /gists/{gist_id}', {
			gist_id: env.PRIVATE_GITHUB_GIST_ID,
			files: { [env.PRIVATE_GITHUB_GIST_FILENAME]: { content: JSON.stringify({ record }, null, 2) } },
			headers
		});

		cache.update(record);

		return json(cache.get());
	}
});
