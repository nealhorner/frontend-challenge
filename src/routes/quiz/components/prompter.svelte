<script lang="ts">
  import Question from '$lib/components/Question.svelte';

  export let quizData;

  let currentQuestionId: string =
    quizData.quizQuestions.find((question: { isAnswered: boolean }) => {
      return !question.isAnswered;
    }).questionId ?? quizData.quizQuestions[quizData.quizQuestions.length - 1].questionId;
</script>

<div
  style="border-radius: 4px; height: 500px; max-width: 1000px; background-color: #DDD; padding: 10px; margin: 0 auto;"
>
  {#if quizData.isCompleted}
    <p>Finished Quiz</p>
  {:else}
    <h3>The current question is: {currentQuestionId}</h3>
    <Question questionId={currentQuestionId} />
  {/if}
</div>
