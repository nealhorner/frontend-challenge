<script lang="ts">
  import Question from '$lib/components/Question.svelte';

  export let quizData;

  let isComplete = quizData.completedQuestions.length === quizData.questions.length;
  let currentQuestionId: number =
    quizData.questions.find((q: number) => !quizData.completedQuestions.includes(q)) ??
    quizData.questions[quizData.questions.length - 1];
</script>

{#if isComplete}
  <p>Finished Quiz</p>
{:else}
  <p>
    the current question is: {currentQuestionId}
    Question: <Question questionId={currentQuestionId} />
  </p>
{/if}
