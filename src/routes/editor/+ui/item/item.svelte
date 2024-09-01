<script lang="ts">
	import { draggable, type OnDragDrop } from './draggable';
	import Cover from './cover.svelte';
	import type { JsonBinItem } from '$lib/json-bin';

	export let handleChange: (event: Event) => void;
	export let index: number;
	export let item: JsonBinItem;
	export let onDragDrop: OnDragDrop;

	$: number = index + 1;
</script>

<div class="root draggable" class:even={number % 2 === 0} use:draggable={onDragDrop} data-index={index}>
	<div class="number">{number}</div>

	<Cover {item} {handleChange} />

	<div class="input-cell name">
		<input type="text" bind:value={item.name} on:change={handleChange} />
	</div>
	<div class="input-cell brewery">
		<input type="text" bind:value={item.brewery} on:change={handleChange} />
	</div>
	<div class="input-cell style">
		<input type="text" bind:value={item.style} on:change={handleChange} />
	</div>

	<div class="input-cell meta">
		<input type="text" maxlength="3" bind:value={item.attrs.ibu} on:change={handleChange} />
	</div>

	<div class="input-cell meta">
		<input type="text" maxlength="5" bind:value={item.attrs.alc} on:change={handleChange} />
	</div>

	<div class="input-cell meta">
		<input type="text" maxlength="4" bind:value={item.attrs.price04} on:change={handleChange} />
	</div>

	<div class="input-cell meta">
		<input type="text" maxlength="4" bind:value={item.attrs.price025} on:change={handleChange} />
	</div>
</div>

<style lang="postcss">
	.root {
		display: flex;
		align-items: center;
		color: #161a1d;
		height: 50px;
		background-color: #f8f9fa;

		&.even {
			background-color: #e9ecef;
		}

		&:hover {
			background-color: rgba(225, 234, 90, 0.3);
			cursor: pointer;
		}
	}

	:global(body.dragging) .root:global(.draggable) * {
		pointer-events: none;
	}

	.root:global(.highlighted) {
		opacity: 0.5;
	}

	.root:global(.over) {
		transform: scale(1.05);
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
	}

	.number {
		width: 50px;
		font-size: 32px;
		font-weight: 400;
		text-align: center;
		cursor: grab;
		color: #495057;
		font-weight: 600;
	}

	.input-cell {
		padding: 0 10px;
		flex-shrink: 0;
		flex-grow: 1;

		&.brewery,
		&.style {
			width: 140px;
		}

		&.meta {
			width: 80px;
		}

		& input {
			border: 1px solid #dee2e6;
			padding: 8px 8px;
			background: #fff;
			font-size: 14px;
			width: 100%;
		}
	}
</style>
