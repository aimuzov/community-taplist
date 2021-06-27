<script>
	import { IMGBB_URL } from '$lib/env';
	import Spinner from '$lib/Spinner.svelte';

	export let item;
	export let number;
	export let onChangeItem;

	let coverInputEl;
	let coverChanging;

	function removeBase64Prefix(base64string) {
		return base64string.substr(base64string.indexOf(',') + 1);
	}

	function getRequestBodyForUploadCover(image) {
		const reader = new FileReader();

		reader.readAsDataURL(image);

		return new Promise((resolve) => {
			reader.onload = () => {
				const formData = new FormData();
				const imageAsString = removeBase64Prefix(reader.result);

				formData.append('image', imageAsString);

				const body = new URLSearchParams(formData);

				resolve(body);
			};
		});
	}

	async function changeCover(event) {
		coverChanging = true;

		const [image] = event.target.files;
		const body = await getRequestBodyForUploadCover(image);
		const cover = await uploadCover(body);

		onChangeItem({
			...item,
			cover
		});

		coverChanging = false;
	}

	async function uploadCover(body) {
		const response = await fetch(IMGBB_URL, { method: 'POST', body: body });

		const result = await response.json();
		const { url } = result.data;

		return url;
	}
</script>

<div class="root" class:even={number % 2 === 0}>
	<div class="number">{number}</div>
	<div
		class="cover"
		style="background-image: url({coverChanging ? '' : item.cover})"
		on:click={() => coverInputEl.click()}
	>
		{#if coverChanging}
			<div class="spinner">
				<Spinner size="25px" />
			</div>
		{:else}
			<img src={item.cover} alt="" />
			<input
				style="display:none"
				type="file"
				accept=".jpg, .jpeg, .png"
				on:change={changeCover}
				bind:this={coverInputEl}
			/>
		{/if}
	</div>
	<div class="input-cell name">
		<input type="text" bind:value={item.name} />
	</div>
	<div class="input-cell brewery">
		<input type="text" bind:value={item.brewery} />
	</div>
	<div class="input-cell style">
		<input type="text" bind:value={item.style} />
	</div>

	<div class="input-cell meta">
		<input type="text" maxlength="3" bind:value={item.attrs.ibu} />
	</div>

	<div class="input-cell meta">
		<input type="text" maxlength="5" bind:value={item.attrs.alc} />
	</div>

	<div class="input-cell meta">
		<input type="text" maxlength="4" bind:value={item.attrs.price04} />
	</div>

	<div class="input-cell meta">
		<input type="text" maxlength="4" bind:value={item.attrs.price025} />
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

	.cover {
		color: green;
		position: relative;
		width: 50px;
		height: 50px;
		background-size: cover;
		cursor: pointer;

		img {
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

		&:hover {
			img {
				opacity: 1;
			}
		}
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

		input {
			border: 1px solid #dee2e6;
			padding: 8px 8px;
			background: #fff;
			font-size: 14px;
			width: 100%;
		}
	}

	.spinner {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #f3722c;
	}
</style>
