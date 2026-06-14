<script lang="ts">
  import Prompter from './components/Prompter.svelte';
  import Button from '$lib/components/Button.svelte';
  import type { QuizData } from '$lib/types';

  interface Props {
    data: { quiz: QuizData | null };
  }

  let { data }: Props = $props();
</script>

<div class="quiz-page">
  {#if data.quiz}
    <h1>Quiz #{data.quiz.id}</h1>
    <p>
      Test your knowledge with our quiz. Select a category and start answering questions. Good luck!
    </p>
    <Prompter quizData={data.quiz} />
  {:else}
    <h1>Ready to test your knowledge?</h1>
    <p>Start a new quiz and answer questions across a range of categories. Good luck!</p>
    <form method="post" action="?/start">
      <Button type="submit" kind="primary">Start Quiz</Button>
    </form>
  {/if}
</div>

<style>
  .quiz-page {
    width: 100%;
    padding: var(--page-content-padding) 0;
    max-width: var(--page-content-max-width);
    margin: 0 auto;
  }
</style>
