<script lang="ts">
  import Progress from './components/progress.svelte';
  import Question from '$lib/components/Question.svelte';

  /** @type {import('./$types').PageData} */
  export let data;

  // Compute the number of completed questions from data.questions.length
  let completedQuestions = data.completedQuestions.length;
  let totalQuestions = data.questions.length;
</script>

<div>
  <h1>Quiz #{data.quizId}</h1>

  <div>
    <!-- <Question /> -->
  </div>
  <div>
    <Progress {completedQuestions} {totalQuestions} />
  </div>

  <p>
    Test your knowledge with our quiz. Select a category and start answering questions. Good luck!
  </p>
</div>
