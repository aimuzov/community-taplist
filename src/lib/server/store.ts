import { Octokit } from '@octokit/core';

import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

import { mockItems } from '$lib/mock';
import type { Item, ItemData } from '$lib/types';

const headers = { 'X-GitHub-Api-Version': '2022-11-28' };

// No token in dev: serve the sample list from memory, no GitHub setup needed.
const useMock = dev && !env.PRIVATE_GITHUB_API_TOKEN;

let octokit: Octokit | undefined;

function client() {
	octokit ??= new Octokit({ auth: env.PRIVATE_GITHUB_API_TOKEN });
	return octokit;
}

function gistConfig() {
	const { PRIVATE_GITHUB_GIST_ID: id, PRIVATE_GITHUB_GIST_FILENAME: filename } = env;

	if (!id || !filename) {
		throw new Error('PRIVATE_GITHUB_GIST_ID and PRIVATE_GITHUB_GIST_FILENAME must be set');
	}

	return { id, filename };
}

async function gistRead(): Promise<Item[]> {
	if (useMock) return structuredClone(mockItems);

	const { id, filename } = gistConfig();
	const { data } = await client().request('GET /gists/{gist_id}', { gist_id: id, headers });
	const file = data.files?.[filename];

	if (!file) {
		throw new Error(`File "${filename}" not found in gist`);
	}

	// API inlines up to ~1 MB of content, bigger files need a separate fetch.
	const content = file.truncated || !file.content ? await fetch(file.raw_url!).then((r) => r.text()) : file.content;

	return JSON.parse(content).record;
}

async function gistWrite(record: Item[]) {
	if (useMock) return;

	const { id, filename } = gistConfig();

	await client().request('PATCH /gists/{gist_id}', {
		gist_id: id,
		files: { [filename]: { content: JSON.stringify({ record }, null, 2) } },
		headers
	});
}

const cache: ItemData = { items: [], updated: 0 };

function cacheUpdate(items: Item[]) {
	cache.items = items;
	cache.updated = Date.now();
}

export async function itemsGet(): Promise<ItemData> {
	// With PRIVATE_CACHE=1 the gist is read once, the editor refreshes it on save.
	if (cache.updated === 0 || (env.PRIVATE_CACHE !== '1' && !useMock)) {
		cacheUpdate(await gistRead());
	}

	return cache;
}

export async function itemsPut(items: Item[]): Promise<ItemData> {
	await gistWrite(items);
	cacheUpdate(items);

	return cache;
}
