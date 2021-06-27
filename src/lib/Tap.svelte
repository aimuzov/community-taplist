<script>
	export let item;

	const breweryAndStyle = [item.brewery, item.style].filter(Boolean).join(' • ');
</script>

<div class="root">
	<div class="inner">
		<div class="cover" style="background-image: url({item.cover})">
			<div class="number">{item.number || '?'}</div>
		</div>
		<div class="beer-name">
			{item.name}
		</div>
		<div class="brewery-and-style">
			{breweryAndStyle}
		</div>
		<div class="meta">
			<div class="ibu-and-alc">
				IBU {item.attrs.ibu || '---'}<br />
				ALC {item.attrs.alc || '---'}
			</div>
			<div class="price">
				0,4<br />
				<span>{item.attrs.price04}</span>
			</div>
			<div class="price">
				0,25<br />
				<span>{item.attrs.price025}</span>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.root {
		width: 640rem;
		height: 270rem;
		font-size: 16rem;
		padding: 10rem 10rem;
	}

	.inner {
		position: relative;
		background-color: #1e1919;
		border-radius: 10rem;
		width: 620rem;
		height: 250rem;
		padding-left: 216rem;
	}

	.beer-name {
		display: flex;
		align-items: center;
		height: 110rem;
		font-size: 62rem;
		line-height: 50rem;
		font-weight: 700;
		color: #d1d1d1;
	}

	.brewery-and-style {
		font-size: 36rem;
		line-height: 42rem;
		height: 48rem;
		font-weight: 400;
		color: #7e7c7c;
	}

	.meta {
		display: flex;
	}

	.ibu-and-alc {
		width: 160rem;
		font-size: 40rem;
		line-height: 38rem;
		color: #aaa;
	}

	.price {
		width: 120rem;
		font-size: 30rem;
		line-height: 34rem;
		text-align: right;
		padding: 0rem 7rem 0 0;
		color: #aaa;
	}

	.price span {
		font-weight: bold;
		color: #d1d1d1;
		font-size: 55rem;
	}

	.cover {
		position: absolute;
		top: 0;
		left: 0;
		width: 200rem;
		height: 250rem;
		background-position: center;
		background-size: cover;
		border-radius: 10rem;
	}

	.number {
		width: 200rem;
		height: 250rem;
		line-height: 250rem;
		text-align: center;
		color: #fff;
		font-family: 'Blinker';
		font-size: 150rem;
		font-weight: bold;
		color: transparent;
		text-shadow: rgba(0, 0, 0, 0.15) 4rem 4rem 7rem;
		-webkit-text-stroke-width: 3rem;
		-webkit-text-stroke-color: #fff;
		background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)),
			linear-gradient(
				180deg,
				rgba(255, 255, 255, 0) 30.71%,
				rgba(89, 89, 89, 0.12) 56.96%,
				rgba(26, 26, 26, 0.53) 81.53%,
				#1a1a1a 107.22%
			);
	}
</style>
