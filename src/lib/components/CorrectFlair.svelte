<script lang="ts">
  import IconCheck from '~icons/mdi/check-circle-outline';
  import IconClose from '~icons/mdi/close-circle-outline';

  interface Props {
    isCorrect: boolean | undefined | null;
  }

  let { isCorrect }: Props = $props();
</script>

{#if isCorrect === true}
  <span class="flair correct"><IconCheck aria-hidden="true" />Correct</span>
{:else if isCorrect === false}
  <span class="flair incorrect"><IconClose aria-hidden="true" />Incorrect</span>
{/if}

<style>
  .flair {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    align-self: flex-start;
    padding: 0.125rem 0.625rem;
    border: 1px solid;
    border-radius: var(--radius-full);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    white-space: nowrap;
    cursor: default;
  }

  .flair :global(svg) {
    font-size: 0.875rem;
  }

  .correct {
    border-color: var(--color-success);
    background-color: var(--color-success-soft);
    color: var(--color-success-text);
  }

  .incorrect {
    border-color: var(--color-error);
    background-color: var(--color-error-soft);
    color: var(--color-error-text);
  }
</style>
