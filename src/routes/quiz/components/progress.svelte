<script lang="ts">
  export let completedQuestions = 0;
  export let totalQuestions = 0;

  $: value = Math.round((completedQuestions / totalQuestions) * 100);
</script>

<div>
  <progress
    id="quiz-progress"
    {value}
    max="100"
    title={`Completed ${completedQuestions} of ${totalQuestions} questions`}
  /><span>{value}%</span>
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

  /* background: */
  progress::-webkit-progress-bar {
    background-color: var(--color-border);
    width: 100%;
  }
  progress {
    background-color: var(--color-border);
  }

  /* value: */
  progress::-webkit-progress-value {
    background-color: var(--color-purple) !important;
  }
  progress::-moz-progress-bar {
    background-color: var(--color-purple) !important;
  }
  progress {
    color: var(--color-purple);
  }
  span {
    white-space: nowrap;
    width: 50px;
    text-align: right;
    line-height: 19px;
    vertical-align: middle;
  }
</style>
