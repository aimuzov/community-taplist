<script lang="ts">
	import { remoteKey } from '$lib/remote';
	import TapList from './+ui/tap-list.svelte';

	export let data;

	function onKeydown(event: KeyboardEvent) {
		if (remoteKey(event) !== 'back') return;

		event.preventDefault();
		// Full page load, so the meta refresh of this screen does not survive on the home page.
		window.location.href = '/';
	}
</script>

<svelte:window on:keydown={onKeydown} />

<svelte:head>
	<!-- Works even when the TV browser fails to run the client bundle. -->
	<meta http-equiv="refresh" content={String(data.refreshSeconds)} />
</svelte:head>

<TapList columns={data.columns} />
