<script>
	import { IMGBB_URL } from '$lib/env';
	import { draggable } from '$lib/draggable';
	import Spinner from '$lib/Spinner.svelte';

	export let item;
	export let index;
	export let onChangeItem;
	export let onDragDrop;

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

		onChangeItem({ ...item, cover });

		coverChanging = false;
	}

	async function uploadCover(body) {
		const response = await fetch(IMGBB_URL, { method: 'POST', body: body });

		const result = await response.json();
		const { url } = result.data;

		return url;
	}

	$: number = index + 1;
</script>

<div
	class="root"
	use:draggable={onDragDrop}
	data-index={index}
	style="background-image: url({item.cover})"
>
	<div class="inner">
		<div class="heading">
			<span class="number">{number}</span>
			<div class="name">
				{item.name}
			</div>
		</div>

		<div class="main">
			<dl>
				<dt>Brewery • Style</dt>
				<dd>
					{item.brewery || '---'} •
					{item.style || '---'}
				</dd>

				<dt>Ibu • Alc</dt>
				<dd>
					{item.attrs.ibu || '---'} •
					{item.attrs.alc || '---'}
				</dd>

				<dt>0.25 • 0.4</dt>
				<dd>
					{item.attrs.price04 || '---'} •
					{item.attrs.price025 || '---'}
				</dd>
			</dl>
		</div>
	</div>
</div>

<style lang="postcss">
	.root {
		color: #161a1d;
		background-color: #fff;
		margin: 24px 16px;
		border-radius: 12px;
		box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
		overflow: hidden;
		position: relative;
		background-size: cover;

		&::before {
			display: block;
			content: '';
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background-image: linear-gradient(
				to top,
				rgba(255, 255, 255, 0.95),
				rgba(255, 255, 255, 0.7)
			);
		}
	}

	.inner {
		position: relative;
		z-index: 1;
		padding: 8px 8px;
		font-weight: 600;
	}

	.heading {
		display: flex;
		justify-content: start;
	}

	.number {
		color: #fff;
		background-color: rgba(0, 0, 0, 0.6);
		font-size: 22px;
		text-align: center;
		border-radius: 8px;
		width: 32px;
		height: 32px;
		line-height: 32px;
		margin-right: 4px;
		flex-shrink: 0;
	}

	.name {
		font-size: 32px;
		text-shadow: 0px 0px 1px rgba(255, 255, 255, 1);
		line-height: 32px;
	}

	dl {
		display: flex;
		flex-wrap: wrap;
		font-size: 18px;
		text-shadow: 0px 0px 1px rgba(255, 255, 255, 1);

		dt {
			width: 40%;
			text-align: right;
			color: #778a98;

			&::after {
				display: inline;
				content: ':';
			}
		}

		dd {
			width: 60%;
			margin: 0;
			padding-left: 10px;
			text-align: left;
		}
	}
</style>
