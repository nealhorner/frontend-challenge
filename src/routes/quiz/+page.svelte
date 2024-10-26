<script lang="ts">
  import Prompter from './components/Prompter.svelte';
  import type { QuizData } from '$lib/types';

  export let data: QuizData;
</script>

<div class="quiz-page">
  <h1>Quiz #{data.id}</h1>
  <p>
    Test your knowledge with our quiz. Select a category and start answering questions. Good luck!
  </p>
  <Prompter quizData={data} />
</div>

<style>
  .quiz-page {
    width: 100%;
    padding: var(--page-content-padding) 0;
    max-width: var(--page-content-max-width);
    margin: 0 auto;
  }
</style>
