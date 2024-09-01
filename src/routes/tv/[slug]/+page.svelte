<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import TapList from './+ui/tap-list.svelte';
	import type { JsonBinItemData } from '$lib/json-bin';
	import { PUBLIC_DATA_UPDATE_INTERVAL } from '$env/static/public';

	export let data: JsonBinItemData;

	async function dataCheckOutdate() {
		const dataNext = await window.fetch(`/tv/${$page.params.slug}`).then((r) => r.json());

		if (dataNext.updated > data.updated) {
			data = { ...dataNext };
		}
	}

	onMount(() => {
		const timeoutId = setInterval(dataCheckOutdate, Number(PUBLIC_DATA_UPDATE_INTERVAL));
		return () => clearInterval(timeoutId);
	});
</script>

<TapList list={data.items}></TapList>
