<script lang="ts">
	import type { Item } from '$lib/types';
	import Spinner from './spinner.svelte';

	export let item: Item;
	export let handleChange: (event: Event) => void;

	let inputEl: HTMLInputElement;
	let coverChanging = false;

	// Covers are stored inline in the gist as data URLs, so keep them small.
	const COVER_SIZE_MAX = 250;
	const COVER_QUALITY = 0.85;

	async function coverToDataUrl(file: File) {
		const bitmap = await createImageBitmap(file);
		const ratio = Math.min(1, COVER_SIZE_MAX / bitmap.width, COVER_SIZE_MAX / bitmap.height);

		const canvas = document.createElement('canvas');

		canvas.width = Math.round(bitmap.width * ratio);
		canvas.height = Math.round(bitmap.height * ratio);
		canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
		bitmap.close();

		return canvas.toDataURL('image/jpeg', COVER_QUALITY);
	}

	function change(event: Event) {
		const file = (event.currentTarget as HTMLInputElement).files?.[0];

		if (!file) return;

		coverChanging = true;

		coverToDataUrl(file)
			.then((cover) => {
				item.cover = cover;
				handleChange(event);
			})
			.catch((error) => alert(`Не удалось обработать картинку: ${error}`))
			.finally(() => (coverChanging = false));
	}
</script>

<button class="root" on:click={() => inputEl.click()} style="background-image: url({item.cover})">
	<input class="input" type="file" accept=".jpg, .jpeg, .png" on:change={change} bind:this={inputEl} />
	<img class="image" src={item.cover} alt="" />

	{#if coverChanging}
		<div class="spinner">
			<Spinner />
		</div>
	{/if}
</button>

<style>
	.root {
		display: block;
		border: none;
		padding: 0;
		position: relative;
		border: none;
		width: 50px;
		height: 50px;
		background-size: cover;
		cursor: pointer;

		&:hover img {
			opacity: 1;
		}
	}

	.image {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
		max-width: 200px;
		max-height: 250px;
		pointer-events: none;
		transition: all 0.25s ease-out;
		opacity: 0;
		box-shadow: 0 0 24px rgba(0, 0, 0, 0.5);
		border: #fff 15px solid;
	}

	.spinner {
		background: rgba(255, 255, 255, 0.9);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.input {
		display: none;
	}
</style>
