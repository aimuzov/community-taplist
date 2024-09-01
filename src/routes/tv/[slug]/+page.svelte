<script>
	import TapList from './+ui/tap-list.svelte';
	export let data;
</script>

<TapList list={data.items}></TapList>
