<script lang="ts">
  import { goto } from '$app/navigation';
  import Card from '$lib/components/Card.svelte';
  import Question from '$lib/components/Question.svelte';
  import Progress from './Progress.svelte';
  import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';
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
      return question.isAnswered ? acc + 1 : (acc ?? 0);
    }, 0);
  }

  // Compute the number of completed questions from data.questions.length
  let completedQuestions = $state(getCompletedQuestionsCount());
  let totalQuestions = quizData.quizQuestions.length ?? defaultQuizSize;
  let submitError: string | undefined = $state();
  // Guards against double-clicks/retries firing a second submit while one is
  // still in flight — without this, a late-arriving response (e.g. a 400 for
  // the now-already-answered question) could set submitError after an
  // earlier, successful request already advanced the quiz.
  let isSubmitting = false;

  async function handleQuestionSubmit(answer: string) {
    if (isSubmitting) return;
    isSubmitting = true;
    submitError = undefined;

    try {
      let response: Response;
      try {
        response = await fetch('/api/quiz/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quizId: quizData.id,
            questionId: currentQuestionId,
            userAnswer: answer
          })
        });
      } catch {
        submitError = 'Failed to submit your answer. Check your connection and try again.';
        return;
      }

      if (!response.ok) {
        submitError = 'Failed to submit your answer. Please try again.';
        return;
      }

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
    } finally {
      isSubmitting = false;
    }
  }
</script>

<Card>
  {#if quizData.isCompleted}
    <p>Finished Quiz</p>
  {:else if currentQuestionId}
    <DebugInfo>Question ID: {currentQuestionId}</DebugInfo>
    <Question questionId={currentQuestionId} submitHandler={handleQuestionSubmit} />
    {#if submitError}
      <div role="alert">
        <ErrorMessage errorMessage={submitError} />
      </div>
    {/if}
  {/if}
  <Progress {completedQuestions} {totalQuestions} />
</Card>
