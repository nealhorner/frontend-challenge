<script lang="ts">
  import type { PageData } from './$types';
  import CorrectFlair from '$lib/components/CorrectFlair.svelte';
  import QuestionTag from '$lib/components/QuestionTag.svelte';

  export let data: PageData;

  console.log(data);
  console.log(data.quizResult.quizQuestions);
</script>

<main>
  <h1>Results for {data.quizResult.title}</h1>
  <p>Score: {data.quizResult.score} pts</p>

  {#each data.quizResult.quizQuestions as question}
    <section>
      <div>
        <h3>{question.question.title}</h3>
        <h2>{question.question.prompt}</h2>
        <p>Your Answer: {question.answer}</p>
        <p>Correct Answer(s): {JSON.parse(question.question.answers).join(', ')}</p>
      </div>
      <CorrectFlair isCorrect={question.isCorrect} />

      {#each JSON.parse(question.question.tags) as tag}
        <QuestionTag {tag} />
      {/each}
    </section>
  {/each}
</main>

<style>
  h1 {
    text-align: left;
    margin: 0;
  }
  main {
    padding: var(--page-content-padding);
    width: 100%;
    max-width: var(--page-content-max-width);
    margin: 0 auto;
  }

  section {
    border: 1px solid var(--color-border);
    border-top: none;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
  }

  section:first-of-type {
    border-top: 1px solid var(--color-border);
    border-radius: var(--card-border-radius) var(--card-border-radius) 0 0;
  }

  section:last-of-type {
    border-radius: 0 0 var(--card-border-radius) var(--card-border-radius);
  }

  section div {
    flex: 1;
  }

  section h3 {
    margin: 0;
  }
</style>
