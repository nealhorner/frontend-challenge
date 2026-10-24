<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    // narrow: forms (login, register); medium: reading and quiz pages;
    // wide: grids (learn, profile).
    width?: 'narrow' | 'medium' | 'wide';
  }

  let { children, width = 'wide' }: Props = $props();
</script>

<main class="page-content {width}">
  {@render children?.()}
</main>

<style>
  .page-content {
    width: 100%;
    max-width: var(--page-content-max-width);
    margin: 0 auto;
    padding: var(--space-xl) var(--page-content-padding) var(--space-2xl);
  }

  .medium {
    max-width: calc(52rem + 2 * var(--page-content-padding));
  }

  .narrow {
    max-width: calc(28rem + 2 * var(--page-content-padding));
  }
</style>
