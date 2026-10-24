<script lang="ts">
  import type { PageData } from './$types';
  import ButtonLink from '$lib/components/ButtonLink.svelte';
  import PageContent from '$lib/components/PageContent.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import IconChevronRight from '~icons/mdi/chevron-right';
  import IconPlay from '~icons/mdi/play';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<svelte:head>
  <title>Quiz Results — Frontend Challenge</title>
</svelte:head>

<PageContent width="medium">
  <PageHeader eyebrow="Quiz history" title="Quiz Results">
    <p>Every quiz you've finished. Open one to review each answer.</p>
    {#snippet actions()}
      <ButtonLink href="/quiz"><IconPlay />Start a Quiz</ButtonLink>
    {/snippet}
  </PageHeader>

  {#if data.quizResult.length}
    <ul class="results">
      {#each data.quizResult as result (result.id)}
        <li>
          <a href={`/quiz/results/${result.id}`}>
            <span class="title">{result.title}</span>
            <span class="score">Score: {result.score} pts</span>
            <IconChevronRight class="chevron" aria-hidden="true" />
          </a>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="empty">No finished quizzes yet. Your results will show up here.</p>
  {/if}
</PageContent>

<style>
  .results {
    margin: 0;
    padding: 0;
    list-style: none;
    overflow: hidden;
    border: 1px solid var(--color-border-card);
    border-radius: var(--radius-card);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-card);
  }

  li + li {
    border-top: 1px solid var(--color-border);
  }

  a {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md) var(--space-lg);
    color: var(--color-text);
    text-decoration: none;
    transition: background-color var(--transition-fast);
  }

  a:hover {
    background-color: var(--color-hover);
    text-decoration: none;
  }

  a:focus-visible {
    outline-offset: -2px;
  }

  .title {
    flex: 1;
    min-width: 0;
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  .score {
    color: var(--color-text-secondary);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    white-space: nowrap;
  }

  a :global(.chevron) {
    flex-shrink: 0;
    color: var(--color-text-muted);
  }

  .empty {
    margin: 0;
    padding: var(--space-xl);
    border: 1px dashed var(--color-border-strong);
    border-radius: var(--radius-card);
    color: var(--color-text-secondary);
    text-align: center;
  }
</style>
