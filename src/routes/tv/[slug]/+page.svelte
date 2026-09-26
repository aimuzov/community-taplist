<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import TapList from './+ui/tap-list.svelte';
	import type { ItemData } from '$lib/json-provider';
	import { env } from '$env/dynamic/public';

	export let data: ItemData;

	async function dataCheckOutdate() {
		const dataNext = await window.fetch(`/tv/${$page.params.slug}`).then((r) => r.json());

		if (dataNext.updated > data.updated) {
			data = { ...dataNext };
		}
	}

	onMount(() => {
		const timeoutId = setInterval(dataCheckOutdate, Number(env.PUBLIC_DATA_UPDATE_INTERVAL));
		return () => clearInterval(timeoutId);
	});
</script>

<TapList list={data.items}></TapList>
