<script lang="ts">
  import { page } from '$app/state';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import { SITE_URL } from '$lib/constants';
  import './styles.css';

  let { data, children } = $props();
  let canonicalUrl = $derived(SITE_URL + page.url.pathname);
</script>

<svelte:head>
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:url" content={canonicalUrl} />
</svelte:head>

<div class="app">
  <Header isAuthenticated={data.isAuthenticated} />
  <div class="page-content">
    {@render children?.()}
  </div>
  <Footer />
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .page-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-sizing: border-box;
  }
</style>
