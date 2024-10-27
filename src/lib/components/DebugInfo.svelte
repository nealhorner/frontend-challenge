<script lang="ts">
  import { debug } from '$lib/constants';
</script>

{#if debug}
  <p>
    <slot />
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
