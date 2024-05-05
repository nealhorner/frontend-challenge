<script>
  import { Router, Link, Route } from "svelte-routing";
	import Header from "./lib/components/Header.svelte";
  import Home from "./routes/Home.svelte";

  export let url = "";
</script>

<div>
	<Header/>
	<Router {url}>
		<nav>
			<Link to="/">Home</Link>
		</nav>
		<div>
			<Route path="/"><Home /></Route>
		</div>
	</Router>
</div>
