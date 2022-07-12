<script context="module">
	import * as api from '$lib/api';

	export async function load() {
		const items = await api.get();

		return { props: { list: items } };
	}
</script>

<script>
	import { createForm } from 'svelte-forms-lib';
	import EditorTable from '$lib/EditorTable.svelte';

	export let list;

	let loading = false;

	const { form, handleSubmit } = createForm({
		initialValues: list,
		onSubmit: async (values) => {
			loading = true;
			$form = await api.update(values);
			loading = false;
		}
	});
</script>

<div class="root">
	<div class="inner">
		<div class="button" class:loading on:click={handleSubmit}>Сохранить</div>
		<div class="heading">Таплист</div>

		<form>
			<EditorTable {form} />
		</form>
	</div>
</div>

<style lang="postcss">
	.root {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 25px 50px;

		& :global(*) {
			box-sizing: border-box;
			outline: 0;
		}
	}

	.inner {
	}

	.heading {
		color: #8d99ae;
		font-size: 48px;
		font-weight: 400;
		margin: 25px 0;
		text-align: center;
	}

	.button {
		display: block;
		position: fixed;
		background-color: rgba(35, 193, 54, 0.9);
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
		padding: 10px 20px 15px;
		color: #fff;
		border: none;
		font-size: 32px;
		line-height: 1;
		text-align: center;
		z-index: 2;
		cursor: pointer;

		&.loading {
			animation: loading;
			animation-duration: 1s;
			animation-iteration-count: infinite;
		}

		&:hover {
			background-color: rgba(65, 245, 87, 1);
		}
	}

	@keyframes loading {
		0% {
			background-color: #f4a261;
		}

		50% {
			background-color: #e76f51;
		}

		100% {
			background-color: #f4a261;
		}
	}
</style>
