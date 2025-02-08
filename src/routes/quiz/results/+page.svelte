<script lang="ts">
  import type { PageData } from './$types';
  import ButtonLink from '$lib/components/ButtonLink.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  console.log(data);
</script>

<main>
  <div class="results-header">
    <div>
      <h1>Quiz Results</h1>
      <p>A list of all quiz results</p>
    </div>
    <ButtonLink href="/quiz">Back to Quiz</ButtonLink>
  </div>

  {#each data.quizResult as result}
    <a href={`/quiz/results/${result.id}`}>
      <section>
        <h2>{result.title}</h2>
        <p>Score: {result.score} pts</p>
      </section>
    </a>
  {/each}
</main>

<style>
  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  h1 {
    text-align: left;
    margin: 0;
  }
  p {
    text-align: left;
  }
  main {
    padding: var(--page-content-padding);
    width: 100%;
    max-width: var(--page-content-max-width);
    margin: 0 auto;
  }
  a {
    text-decoration: none;
    color: var(--link-color);
  }
  a:visited {
    color: var(--link-visited-color);
  }
  section {
    padding: 1rem;
    border: 1px solid var(--color-border);
    border-top: none;
    display: flex;
    justify-content: space-between;
  }

  section:hover {
    outline: 1px solid var(--color-border);
  }

  a:first-of-type section {
    border-top: 1px solid var(--color-border);
    border-radius: var(--card-border-radius) var(--card-border-radius) 0 0;
  }

  a:last-of-type section {
    border-radius: 0 0 var(--card-border-radius) var(--card-border-radius);
  }

  h2 {
    text-decoration: underline;
    font-weight: bold;
    margin: 0;
  }

  p {
    margin: 0;
  }
</style>
