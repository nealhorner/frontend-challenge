<script>
  import { Router, Route } from 'svelte-routing';
  import Header from './lib/components/Header.svelte';
  import Home from './routes/Home.svelte';
  import Learn from './routes/Learn.svelte';
  import Login from './routes/Login.svelte';

  export let url = '';
</script>

<div>
  <Header />
  <Router {url}>
    <Route path="/" component={Home} />
    <Route path="/learn" component={Learn} />
    <Route path="/login" component={Login} />
  </Router>
</div>
