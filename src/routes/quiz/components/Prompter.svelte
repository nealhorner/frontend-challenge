<script lang="ts">
  import { goto } from '$app/navigation';
  import Card from '$lib/components/Card.svelte';
  import Question from '$lib/components/Question.svelte';
  import Progress from './Progress.svelte';
  import type { QuizData } from '$lib/types';
  import { defaultQuizSize } from '$lib/constants';
  import DebugInfo from '$lib/components/DebugInfo.svelte';

  interface Props {
    quizData: QuizData;
  }

  let { quizData = $bindable() }: Props = $props();

  let currentQuestionId: string | undefined = $state(getNextQuestionId());

  function getNextQuestionId() {
    return (
      quizData.quizQuestions.find((question: { isAnswered: boolean }) => {
        return !question.isAnswered;
      })?.questionId ?? quizData.quizQuestions[quizData.quizQuestions.length - 1]?.questionId
    );
  }

  function getCompletedQuestionsCount() {
    return quizData.quizQuestions.reduce((acc, question) => {
      return question.isAnswered ? acc + 1 : acc ?? 0;
    }, 0);
  }

  // Compute the number of completed questions from data.questions.length
  let completedQuestions = $state(getCompletedQuestionsCount());
  let totalQuestions = quizData.quizQuestions.length ?? defaultQuizSize;

  async function handleQuestionSubmit(answer: string) {
    // Update database record
    await fetch('/api/quiz/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizId: quizData.id,
        questionId: currentQuestionId,
        userAnswer: answer
      })
    });

    // Update local object
    quizData.quizQuestions = quizData.quizQuestions.map((question) => {
      if (question.questionId === currentQuestionId) {
        question.isAnswered = true;
      }
      return question;
    });

    currentQuestionId = getNextQuestionId();
    completedQuestions = getCompletedQuestionsCount();

    if (completedQuestions === totalQuestions) {
      quizData.isCompleted = true;
      goto(`/quiz/results/${quizData.id}`);
    }
  }
</script>

<Card>
  {#if quizData.isCompleted}
    <p>Finished Quiz</p>
  {:else if currentQuestionId}
    <DebugInfo>Question ID: {currentQuestionId}</DebugInfo>
    <Question questionId={currentQuestionId} submitHandler={handleQuestionSubmit} />
  {/if}
  <Progress {completedQuestions} {totalQuestions} />
</Card>
