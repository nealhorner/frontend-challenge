<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import Question from '$lib/components/Question.svelte';
  import Progress from './Progress.svelte';
  import type { QuizData } from '$lib/types';
  import { defaultQuizSize } from '$lib/constants';
  export let quizData: QuizData;

  let currentQuestionId: string | undefined =
    quizData.quizQuestions.find((question: { isAnswered: boolean }) => {
      return !question.isAnswered;
    })?.questionId ?? quizData.quizQuestions[quizData.quizQuestions.length - 1]?.questionId;

  // Compute the number of completed questions from data.questions.length
  let completedQuestions = quizData.quizQuestions.reduce((acc, question) => {
    return question.isAnswered ? acc + 1 : acc ?? 0;
  }, 0);
  let totalQuestions = quizData.quizQuestions.length ?? defaultQuizSize;
</script>

<Card>
  {#if quizData.isCompleted}
    <p>Finished Quiz</p>
  {:else if currentQuestionId}
    <h3>The current question is: {currentQuestionId}</h3>
    <Question questionId={currentQuestionId} />
  {/if}
  <Progress {completedQuestions} {totalQuestions} />
</Card>
