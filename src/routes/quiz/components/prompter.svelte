<script lang="ts">
  import Question from '$lib/components/Question.svelte';

  export let quizData;

  let isComplete = quizData.completedQuestions.length === quizData.questions.length;
  let currentQuestionId: number =
    quizData.questions.find((q: number) => !quizData.completedQuestions.includes(q)) ??
    quizData.questions[quizData.questions.length - 1];
</script>

<div
  style="border-radius: 4px; height: 500px; max-width: 1000px; background-color: #DDD; padding: 10px; margin: 0 auto;"
>
  {#if isComplete}
    <p>Finished Quiz</p>
  {:else}
    <h3>The current question is: {currentQuestionId}</h3>
    <Question questionId={currentQuestionId} />
  {/if}
</div>
