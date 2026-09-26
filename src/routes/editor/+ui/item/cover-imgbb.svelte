<script lang="ts">
	import { env } from '$env/dynamic/public';
	import type { Item } from '$lib/json-provider';
	import Spinner from './spinner.svelte';

	export let item: Item;
	export let handleChange: (event: Event) => void;

	let inputEl: HTMLInputElement;
	let coverChanging: PromiseLike<void> | null = null;

	function removeBase64Prefix(base64string: string) {
		return base64string.substr(base64string.indexOf(',') + 1);
	}

	function getRequestBodyForUploadCover(image: Blob) {
		const reader = new FileReader();

		reader.readAsDataURL(image);

		return new Promise<URLSearchParams>((resolve) => {
			reader.onload = () => {
				const formData = new FormData();

				console.log(reader.result);

				const imageAsString = removeBase64Prefix(reader.result as string);

				formData.append('image', imageAsString);

				const body = new URLSearchParams(formData as unknown as Record<string, string>);

				resolve(body);
			};
		});
	}

	function change(event: Event) {
		coverChanging = Promise.resolve().then(async () => {
			if (event.target && 'files' in event.target) {
				const body = await getRequestBodyForUploadCover((event.target.files as Blob[])[0]);

				item.cover = await upload(body);
				handleChange(event);
			}
		});

		coverChanging.then(
			() => (coverChanging = null),
			() => (coverChanging = null)
		);
	}

	async function upload(body: URLSearchParams) {
		const response = await fetch(env.PUBLIC_IMGBB_URL, { method: 'POST', body: body });
		const result = await response.json();
		const { url } = result.data;

		return url;
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
