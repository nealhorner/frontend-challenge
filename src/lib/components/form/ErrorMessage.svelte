<script lang="ts">
  interface Props {
    errorMessage: string;
  }

  let { errorMessage }: Props = $props();
</script>

<p>
  <span class="error">{errorMessage}</span>
</p>

<style>
  .error {
    color: var(--ocean-color-red-sun);
  }
</style>
