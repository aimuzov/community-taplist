<script>
	import Item from './table-item.svelte';
	export let items;
	export let handleChange;
</script>

<div class="root">
	<div class="head">
		<div class="head-cell number">#</div>
		<div class="head-cell cover" />
		<div class="head-cell name">Название</div>
		<div class="head-cell">Пивоварня</div>
		<div class="head-cell">Стиль</div>
		<div class="head-cell meta">IBU</div>
		<div class="head-cell meta">ALC</div>
		<div class="head-cell meta">0.4</div>
		<div class="head-cell meta">0.25</div>
	</div>

	{#each $items as item, index (item)}
		<Item
			{handleChange}
			{item}
			{index}
			onChangeItem={(item) => {
				// $items[index] = item;
				// $items = [...$items];
			}}
			onDragDrop={(currentIndex, nextIndex) => {
				const element = $items[currentIndex];

				$items[currentIndex] = $items[nextIndex];
				$items[nextIndex] = element;
				// changed = true;
				// $items = [...$items];
			}}
		/>
	{/each}
</div>

<style lang="postcss">
	.root {
		background-color: #fff;
	}

	.head {
		display: flex;
	}

	.head-cell {
		width: 140px;
		height: 50px;
		line-height: 50px;
		text-align: center;
		text-transform: uppercase;
		font-weight: 700;
		font-size: 18px;
		color: #343a40;
	}

	/* prettier-ignore */
	.head-cell {
		&.number	{ width: 50px; font-size: 32px; }
		&.cover		{ width: 50px; }
		&.name		{ width: 200px; }
		&.meta		{ width: 80px; }
	}
</style>
