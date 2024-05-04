<script lang="ts">
	import { page } from '$app/stores';
	let currentRoute: string;

	// Give currentRoute as type of string. $: currentRoute = $page.url.pathname;
	$: currentRoute = $page.url.pathname;
</script>

<header>
	<nav>
		<a href="/"><h2>Frontend Quiz</h2></a>
		<a href="/" class:is-active={currentRoute === '/'}>Home</a>
		<a href="/questions" class:is-active={currentRoute === '/questions'}>Questions</a>
		<a href="/profile" class:is-active={currentRoute === '/profile'}>Profile</a>
	</nav>
</header>
<slot />

<style>
	header {
		box-sizing: border-box;
		background-color: #333;
		color: white;
		padding: 8px 16px;
		height: 80px;
		display: flex;
		align-items: center;
	}
	h2 {
		margin: 0;
		padding-right: 50px;
	}
	nav {
		display: flex;
		flex-basis: 0%;
		flex-grow: 1;
		flex-shrink: 1;
		justify-content: left;
		column-gap: 16px;
		row-gap: 16px;
		align-items: center;
		font-size: 16px;
		font-stretch: 100%;
		line-height: normal;
	}
	nav a {
		color: #ddd;
		text-decoration: none;
		line-height: 16px;
		padding: 16px;
		vertical-align: middle;
	}
	nav a:hover {
		color: white;
		border-radius: 10px;
		top: -2px;
		position: relative;
	}
	nav a.is-active {
		color: white;
		font-weight: bold;
		background-color: black;
		border-radius: 10px;
	}
</style>
