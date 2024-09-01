<script>
	import { PUBLIC_IMGBB_URL } from '$env/static/public';
	import { draggable } from './draggable.js';
	import Spinner from './spinner.svelte';

	// export let name;
	// export let cover;
	// export let brewery;
	// export let style;
	// export let attrs;
	export let handleChange;

	export let item;
	export let index;
	export let onChangeItem;
	export let onDragDrop;

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
		coverChanging = Promise.resolve().then(async () => {
			const body = await getRequestBodyForUploadCover(event.target.files[0]);

			item.cover = await uploadCover(body);
			handleChange(event);
		});

		coverChanging.then(
			() => (coverChanging = null),
			() => (coverChanging = null)
		);
	}

	async function uploadCover(body) {
		const response = await fetch(PUBLIC_IMGBB_URL, { method: 'POST', body: body });

		const result = await response.json();
		const { url } = result.data;

		return url;
	}

	$: number = index + 1;
</script>

<div class="root draggable" class:even={number % 2 === 0} use:draggable={onDragDrop} data-index={index}>
	<div class="number">{number}</div>

	<button class="cover" style="background-image: url({item.cover})" on:click={() => coverInputEl.click()}>
		<img src={item.cover} alt="" />
		<input
			style="display:none"
			type="file"
			accept=".jpg, .jpeg, .png"
			on:change={changeCover}
			bind:this={coverInputEl}
		/>

		{#if coverChanging}
			<div class="spinner">
				<Spinner size="25px" />
			</div>
		{/if}
	</button>

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

	.cover {
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

	.cover img {
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

	.spinner {
		background: rgba(255, 255, 255, 0.9);
		posittion: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
