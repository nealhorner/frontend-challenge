<script>
  import { Router, Link, Route } from "svelte-routing";
	import Header from "./lib/components/Header.svelte";
  import Home from "./routes/Home.svelte";

  export let url = "";
</script>

<div>
	<Header/>
	<Router {url}>
		<Route path="/"><Home /></Route>
	</Router>
</div>
