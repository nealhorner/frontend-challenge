<script lang="ts">
  import Prompter from './components/Prompter.svelte';
  import Button from '$lib/components/Button.svelte';
  import PageContent from '$lib/components/PageContent.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import { defaultQuizSize } from '$lib/constants';
  import type { QuizData } from '$lib/types';
  import IconPlay from '~icons/mdi/play';

  interface Props {
    data: { quiz: QuizData | null };
  }

  let { data }: Props = $props();
</script>

<svelte:head>
  <title>Quiz — Frontend Challenge</title>
</svelte:head>

<PageContent width="medium">
  {#if data.quiz}
    <PageHeader eyebrow="Quiz in progress" title={data.quiz.title}>
      <p>Answer each question and submit to move on. You'll see every correct answer at the end.</p>
    </PageHeader>
    <Prompter quizData={data.quiz} />
  {:else}
    <section class="start">
      <PageHeader eyebrow="Ready when you are" title="Ready to test your knowledge?" align="center">
        <p>
          {defaultQuizSize} questions across a mix of topics. Take your time, and see every correct answer
          when you finish.
        </p>
      </PageHeader>
      <form method="post" action="?/start">
        <Button type="submit" kind="primary" size="lg"><IconPlay />Start Quiz</Button>
      </form>
    </section>
  {/if}
</PageContent>

<style>
  .start {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-xl) var(--space-lg);
    border: 1px solid var(--color-border-card);
    border-radius: var(--radius-card);
    background-image: var(--glow-hero);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-card);
  }

  .start :global(.page-header) {
    margin-bottom: var(--space-lg);
  }
</style>
