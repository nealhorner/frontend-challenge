<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<div class="card">
  {@render children?.()}
</div>

<style>
  .card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border-card);
    border-radius: var(--radius-card);
    padding: var(--space-lg);
    box-shadow: var(--shadow-card);
  }
</style>
