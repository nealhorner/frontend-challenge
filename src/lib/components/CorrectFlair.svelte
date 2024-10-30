<script lang="ts">
  export let isCorrect: boolean | undefined | null;
</script>

{#if isCorrect === true}
  <span
    style="color: var(--color-affirmative-dark); background-color: var(--color-affirmative-light); border-color: var(--color-affirmative-dark)"
  >
    Correct
  </span>
{:else if isCorrect === false}
  <span
    style="color: var(--color-negative-dark); background-color: var(--color-negative-light); border-color: var(--color-negative-dark)"
  >
    Incorrect
  </span>
{/if}

<style>
  span {
    border: 1px solid var(--color-border);
    display: inline;
    padding: 5px;
    border-radius: var(--card-border-radius);
    margin: 0;
    align-self: flex-start;
  }
</style>
