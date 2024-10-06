<script lang="ts">
  export let completedQuestions = 0;
  export let totalQuestions = 0;

  $: value = Math.round((completedQuestions / totalQuestions) * 100);
</script>

<div>
  <progress id="quiz-progress" {value} max="100"> {value}% </progress>
  <p>Completed {completedQuestions} of {totalQuestions} questions</p>
</div>
