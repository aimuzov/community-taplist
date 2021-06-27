<script>
	import EditorTableItem from '$lib/EditorTableItem.svelte';

	export let form;
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
	{#each $form as item, index}
		<EditorTableItem
			{item}
			number={index + 1}
			onChangeItem={(item) => {
				$form[index] = item;
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

		&.number {
			font-size: 32px;
			width: 50px;
		}

		&.cover {
			width: 50px;
		}

		&.name {
			width: 200px;
		}

		&.meta {
			width: 80px;
		}
	}
</style>
