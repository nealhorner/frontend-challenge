<script lang="ts">
  export let errorMessage: string;
</script>

<p>
  <span class="error">{errorMessage}</span>
</p>

<style>
  .error {
    color: red;
  }
</style>
