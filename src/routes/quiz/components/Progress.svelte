<script lang="ts">
  interface Props {
    completedQuestions?: number;
    totalQuestions?: number;
  }

  let { completedQuestions = 0, totalQuestions = 0 }: Props = $props();

  let value = $derived(Math.round((completedQuestions / totalQuestions) * 100));
</script>

<div>
  <progress
    id="quiz-progress"
    {value}
    max="100"
    title={`Completed ${completedQuestions} of ${totalQuestions} questions`}
  ></progress><span>{value}%</span>
</div>

<style>
  div {
    display: flex;
    align-items: center;
  }
  progress {
    flex-grow: 1;
    height: 19px;
  }

  progress::-webkit-progress-bar {
    background-color: var(--color-border);
    width: 100%;
  }
  progress {
    color: var(--color-purple);
    background-color: var(--color-border);
  }
  progress::-webkit-progress-value {
    background-color: var(--color-purple) !important;
  }
  progress::-moz-progress-bar {
    background-color: var(--color-purple) !important;
  }
  span {
    white-space: nowrap;
    width: 50px;
    text-align: right;
    line-height: 19px;
    vertical-align: middle;
  }
</style>
