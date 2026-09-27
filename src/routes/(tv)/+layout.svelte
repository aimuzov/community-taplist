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

	/* Whatever the layout doesn't cover blends into the board instead of showing white. */
	:global(html),
	:global(body) {
		background-color: #131111;
		overflow: hidden;
	}

	/* 1rem is one pixel of the 1920×1080 design, fixed steps for browsers without min(). */
	:global(html) {
		font-size: 1px;
	}

	@media (max-width: 1919px) {
		:global(html) {
			font-size: 0.666666667px;
		}
	}

	@supports (font-size: min(1px, 2px)) {
		:global(html) {
			font-size: min(100vw / 1920, 100vh / 1080);
		}
	}
</style>
