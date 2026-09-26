<script lang="ts">
	import { onMount } from 'svelte';

	import { goto, invalidateAll } from '$app/navigation';
	import { updated } from '$app/stores';
	import { remoteKey } from '$lib/remote';
	import TapList from './+ui/tap-list.svelte';

	export let data;

	function onKeydown(event: KeyboardEvent) {
		if (remoteKey(event) !== 'back') return;

		event.preventDefault();
		goto('/');
	}

	// After a deploy the old client can't load new chunks: reload once to pick them up.
	$: if ($updated) window.location.reload();

	async function refresh() {
		if (await updated.check()) return;

		// Updates the board in place, without the flicker of a full page reload.
		await invalidateAll();
	}

	onMount(() => {
		const intervalId = setInterval(() => refresh().catch(console.error), data.refreshSeconds * 1000);
		return () => clearInterval(intervalId);
	});
</script>

<svelte:window on:keydown={onKeydown} />

<TapList columns={data.columns} />
