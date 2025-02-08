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
    background-color: white;
    border-radius: var(--card-border-radius);
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
</style>
