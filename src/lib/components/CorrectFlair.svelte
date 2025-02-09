<script lang="ts">
  interface Props {
    isCorrect: boolean | undefined | null;
  }

  let { isCorrect }: Props = $props();
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
    border-radius: var(--border-radius-md);
    margin: 0;
    align-self: flex-start;
    cursor: default;
  }
</style>
