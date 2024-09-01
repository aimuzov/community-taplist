<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Table from './+ui/table.svelte';
	import { createForm, Form } from 'svelte-forms-lib';

	export let data;

	const { form, state, isSubmitting, handleSubmit, handleReset, updateInitialValues, handleChange } = createForm({
		initialValues: data.items,
		onSubmit: (values) => {
			return fetch('/editor', {
				method: 'POST',
				body: JSON.stringify(values),
				headers: { 'Content-Type': 'application/json' }
			})
				.then((r) => r.json())
				.then((data) => {
					$form = data.items;
					updateInitialValues($form);
					handleReset();
				});
		}
	});

	function onBeforeUnload(event) {
		if (changed) {
			event.preventDefault();
			event.returnValue = '';
			return;
		}

		delete e['returnValue'];
	}

	onMount(() => {
		window.addEventListener('beforeunload', onBeforeUnload);
		return () => window.removeEventListener('beforeunload', onBeforeUnload);
	});
</script>

<div class="root">
	<div class="inner">
		<form>
			{#if $state.isModified}
				<button
					class="button"
					disabled={$isSubmitting}
					class:loading={$isSubmitting}
					on:click={handleSubmit}
					type="submit">Сохранить</button
				>
			{/if}

			<div class="heading">Таплист</div>
			<Table {handleChange} items={form} />
		</form>
	</div>
</div>

<style lang="postcss">
	:global(body) {
		background-color: #2b2d42;
	}

	.root {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 25px 50px;
	}

	.root :global(*) {
		box-sizing: border-box;
		outline: 0;
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

		&:hover {
			background-color: rgba(65, 245, 87, 1);
		}
	}

	.button.loading {
		animation: loading;
		animation-duration: 1s;
		animation-iteration-count: infinite;
	}

	.button[disabled] {
		cursor: not-allowed;
	}

	/* prettier-ignore */
	@keyframes loading {
		0%		{ background-color: #f4a261; }
		50%		{ background-color: #e76f51; }
		100%	{ background-color: #f4a261; }
	}
</style>
