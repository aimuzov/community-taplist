<script lang="ts">
	import TapList from './+ui/tap-list.svelte';

	export let data;
</script>

<svelte:head>
	<!-- TV browsers get no JS, so fresh data arrives through a plain page reload. -->
	<meta http-equiv="refresh" content={String(data.refreshSeconds)} />
</svelte:head>

<TapList columns={data.columns} />
