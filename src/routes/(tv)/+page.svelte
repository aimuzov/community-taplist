<script lang="ts">
	import { goto } from '$app/navigation';
	import { TV_COUNT } from '$lib/constants';
	import { remoteKey } from '$lib/remote';

	const screens = Array.from({ length: TV_COUNT }, (_, index) => index + 1);

	// Selection lives in state, not in :focus: TV browsers are unreliable with focus.
	let selected = 0;

	function onKeydown(event: KeyboardEvent) {
		const key = remoteKey(event);

		if (key === 'left' || key === 'right') {
			event.preventDefault();
			selected = Math.min(Math.max(selected + (key === 'left' ? -1 : 1), 0), screens.length - 1);
		}

		if (key === 'enter') {
			event.preventDefault();
			goto(`/tv/${screens[selected]}`);
		}
	}
</script>

<svelte:window on:keydown={onKeydown} />

<div class="home">
	{#each screens as screen, index}
		<a class="screen" class:selected={index === selected} href="/tv/{screen}" on:mouseenter={() => (selected = index)}>
			<span class="number">{screen}</span>
			<span class="label">Экран {screen}</span>
		</a>
	{/each}
</div>

<style>
	.home {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1920rem;
		height: 1080rem;
		background-color: #131111;
	}

	.screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 560rem;
		height: 560rem;
		/* Flex gap needs Chromium 84, margins work everywhere. */
		margin: 0 60rem;
		border: 8rem solid transparent;
		border-radius: 24rem;
		background-color: #1e1919;
		color: #7e7c7c;
		text-decoration: none;
		transition:
			transform 0.15s ease-out,
			border-color 0.15s ease-out;
	}

	.screen.selected {
		border-color: #d1d1d1;
		color: #d1d1d1;
		transform: scale(1.05);
	}

	.number {
		font-family: 'Blinker';
		font-size: 320rem;
		font-weight: 700;
		line-height: 1;
	}

	.label {
		font-size: 56rem;
	}
</style>
