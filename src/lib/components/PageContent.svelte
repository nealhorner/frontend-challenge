<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<main class="page-content">
  {@render children?.()}
</main>

<style>
  .page-content {
    width: 100%;
    max-width: 1200px;
    padding: 0 20px;
    margin: 0 auto;
    background-color: aquamarine;
  }
</style>
