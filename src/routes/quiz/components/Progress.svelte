<script lang="ts">
  interface Props {
    completedQuestions?: number;
    totalQuestions?: number;
  }

  let { completedQuestions = 0, totalQuestions = 0 }: Props = $props();

  let value = $derived(
    totalQuestions ? Math.round((completedQuestions / totalQuestions) * 100) : 0
  );
</script>

<div class="progress">
  <div class="labels">
    <span>{completedQuestions} of {totalQuestions} answered</span>
    <span>{value}%</span>
  </div>
  <progress
    id="quiz-progress"
    {value}
    max="100"
    title={`Completed ${completedQuestions} of ${totalQuestions} questions`}
  ></progress>
</div>

<style>
  .progress {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .labels {
    display: flex;
    justify-content: space-between;
    color: var(--color-text-secondary);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
  }

  progress {
    width: 100%;
    height: 6px;
    border: 0;
    border-radius: var(--radius-full);
    background-color: var(--color-border);
    overflow: hidden;
    appearance: none;
    color: var(--color-primary);
  }

  progress::-webkit-progress-bar {
    background-color: var(--color-border);
  }

  progress::-webkit-progress-value {
    border-radius: var(--radius-full);
    background: linear-gradient(90deg, var(--color-info), var(--color-primary));
    transition: width 200ms ease;
  }

  progress::-moz-progress-bar {
    border-radius: var(--radius-full);
    background: linear-gradient(90deg, var(--color-info), var(--color-primary));
  }
</style>
