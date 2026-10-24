<script lang="ts">
  import { debug } from '$lib/constants';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

{#if debug}
  <p>
    {@render children?.()}
  </p>
{/if}

<style>
  p {
    display: inline-block;
    margin: 0 0 var(--space-sm);
    padding: 0.25rem 0.5rem;
    border: 1px dashed var(--color-warning);
    border-radius: var(--radius-sm);
    background-color: var(--color-warning-soft);
    color: var(--color-warning-text);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
  }
</style>
