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
    color: red;
    background-color: lime;
    display: inline-block;
    padding: 0.5rem;
    margin: 0;
    font-weight: bold;
  }
</style>
