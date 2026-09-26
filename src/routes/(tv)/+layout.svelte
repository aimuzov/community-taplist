<main>
	<slot />
</main>

<style>
	main {
		font-family: 'Arsenal';
		font-size: 16rem;
		user-select: none;
	}

	main :global(*) {
		box-sizing: border-box;
		outline: 0;
	}

	:global(html) {
		font-size: 1px;
	}

	@media (max-width: 1919px) {
		:global(html) {
			font-size: 0.666666667px;
		}
	}
</style>
