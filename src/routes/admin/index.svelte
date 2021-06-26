<script context="module">
	import { JSONBIN_SECRET, JSONBIN_ITEMS_URL } from '$lib/env';

	export async function load({ page }) {
		const url = JSONBIN_ITEMS_URL
			? JSONBIN_ITEMS_URL + '/latest'
			: 'http://localhost:3000/items.json';
		const response = await fetch(url, { headers: { 'secret-key': JSONBIN_SECRET } });
		const items = await response.json();

		return { props: { list: items } };
	}
</script>

<script>
	import { createForm } from 'svelte-forms-lib';

	export let list;

	let coverInputEls = [];

	const { form, handleSubmit } = createForm({
		initialValues: list,
		//   validationSchema: yup.object().shape({
		//     name: yup.string().required(),
		//     email: yup
		//       .string()
		//       .email()
		//       .required()
		//   }),
		onSubmit: async (values) => {
			//     return makeRequest().then(() => {
			//     });

			const url = JSONBIN_ITEMS_URL ? JSONBIN_ITEMS_URL : 'http://localhost:3000/items.json';
			const response = await fetch(url, {
				headers: { 'secret-key': JSONBIN_SECRET, 'Content-Type': 'application/json' },
				method: 'PUT',
				body: JSON.stringify(values)
			});
		}
	});

	const onFileSelected = (e, index) => {
		let image = e.target.files[0];
		let reader = new FileReader();
		reader.readAsDataURL(image);
		reader.onload = async (e) => {
			const formData = new FormData();
			const r = reader.result.substr(reader.result.indexOf(',') + 1);

			formData.append('image', r);

			console.log(formData.getAll('image'));

			const response = await fetch(
				'https://api.imgbb.com/1/upload?key=56ffd58dddcdfa4393b41f23e3f12f28',
				{
					method: 'POST',
					body: new URLSearchParams(formData)
				}
			);

			const result = await response.json();

			$form[index].cover = result.data.url;

			const url = JSONBIN_ITEMS_URL ? JSONBIN_ITEMS_URL : 'http://localhost:3000/items.json';
			const response1 = await fetch(url, {
				headers: { 'secret-key': JSONBIN_SECRET, 'Content-Type': 'application/json' },
				method: 'PUT',
				body: JSON.stringify($form)
			});
		};
	};
</script>

<main>
	<form on:submit={handleSubmit}>
		<button type="submit">Сохранить</button>

		<br />
		<br />
		<br />
		{#each $form as item, index}
			<div>
				<img
					class="upload"
					src={item.cover}
					width="100"
					on:click={() => {
						coverInputEls[index].click();
					}}
					alt=""
				/>
				<input
					style="display:none"
					type="file"
					accept=".jpg, .jpeg, .png"
					on:change={(e) => onFileSelected(e, index)}
					bind:this={coverInputEls[index]}
				/>

				<input type="text" bind:value={item.name} />
				<input type="text" bind:value={item.style} />
				<input type="text" bind:value={item.brewery} />
				<input type="text" bind:value={item.attrs.alc} />
				<input type="text" bind:value={item.attrs.ibu} />
				<input type="text" bind:value={item.attrs.price04} />
				<input type="text" bind:value={item.attrs.price025} />
			</div>
		{/each}
		<button type="submit">Сохранить</button>
	</form>
</main>

<style lang="postcss">
	main {
		font-family: 'Arsenal';
		/* font-size: 16rem; */
		--webkit-font-smoothing: antialiased;
		user-select: none;
	}

	main :global(*) {
		box-sizing: border-box;
		outline: 0;
	}
</style>
