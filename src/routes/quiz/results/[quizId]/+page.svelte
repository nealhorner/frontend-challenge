<script lang="ts">
  import type { PageData } from './$types';
  import ButtonLink from '$lib/components/ButtonLink.svelte';
  import CorrectFlair from '$lib/components/CorrectFlair.svelte';
  import PageContent from '$lib/components/PageContent.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import QuestionTag from '$lib/components/QuestionTag.svelte';
  import IconPlay from '~icons/mdi/play';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let questions = $derived(data.quizResult.quizQuestions);
  let correctCount = $derived(questions.filter((q) => q.isCorrect).length);
</script>

<svelte:head>
  <title>Results for {data.quizResult.title} — Frontend Challenge</title>
</svelte:head>

<PageContent width="medium">
  <PageHeader eyebrow="Quiz results" title="Results for {data.quizResult.title}">
    {#snippet actions()}
      <ButtonLink href="/quiz/results" kind="secondary">All Results</ButtonLink>
      <ButtonLink href="/quiz"><IconPlay />Take Another Quiz</ButtonLink>
    {/snippet}
  </PageHeader>

  <div class="summary">
    <p class="score">Score: {data.quizResult.score} pts</p>
    <p class="tally">{correctCount} of {questions.length} correct</p>
  </div>

  <ol class="questions">
    {#each questions as question (question.questionId)}
      <li class="question {question.isCorrect ? 'is-correct' : 'is-incorrect'}">
        <div class="question-head">
          <h3>{question.question.title}</h3>
          <CorrectFlair isCorrect={question.isCorrect} />
        </div>
        <h2>{question.question.prompt}</h2>
        <div class="answers">
          <p class="yours">Your Answer: {question.answer}</p>
          <p class="right">Correct Answer(s): {JSON.parse(question.question.answers).join(', ')}</p>
        </div>
        <div class="tags">
          {#each JSON.parse(question.question.tags) as tag, i (i)}
            <QuestionTag {tag} />
          {/each}
        </div>
      </li>
    {/each}
  </ol>
</PageContent>

<style>
  .summary {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--space-xs) var(--space-lg);
    margin-bottom: var(--space-lg);
    padding: var(--space-md) var(--space-lg);
    border: 1px solid var(--color-primary-border);
    border-radius: var(--radius-card);
    background-color: var(--color-primary-soft);
  }

  .summary p {
    margin: 0;
  }

  .score {
    color: var(--color-text);
    font-size: var(--text-2xl);
    font-weight: 700;
    letter-spacing: var(--tracking-tight);
  }

  .tally {
    color: var(--color-text-secondary);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
  }

  .questions {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .question {
    padding: var(--space-lg);
    border: 1px solid var(--color-border-card);
    border-left-width: 3px;
    border-radius: var(--radius-card);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-sm);
  }

  .is-correct {
    border-left-color: var(--color-success);
  }

  .is-incorrect {
    border-left-color: var(--color-error);
  }

  .question-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-md);
  }

  h3 {
    margin: 0;
    color: var(--color-link);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 600;
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  h2 {
    margin: var(--space-xs) 0 var(--space-md);
    font-size: var(--text-lg);
    line-height: 1.4;
  }

  .answers {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-button);
    background-color: var(--color-surface-sunken);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
  }

  .answers p {
    margin: 0;
    overflow-wrap: anywhere;
  }

  .yours {
    color: var(--color-text-secondary);
  }

  .right {
    color: var(--color-success-text);
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    margin: var(--space-sm) -0.5rem -0.5rem;
  }
</style>
