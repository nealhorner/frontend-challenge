<script lang="ts">
  import { onMount, tick, untrack } from 'svelte';
  import Button from './Button.svelte';
  import RadioGroup from './RadioGroup.svelte';
  import { QuestionType, type ParsedMultipleChoiceOptions, type PublicQuestion } from '$lib/types';

  let answer = $state('');
  let questionPromise: Promise<PublicQuestion> | undefined = $state();
  let containerEl: HTMLElement | undefined;
  let flagOpen = $state(false);
  let flagMessage = $state('');
  let flagStatus = $state<'idle' | 'submitting' | 'sent' | 'error'>('idle');

  async function submitFlag(id: string) {
    if (!flagMessage.trim() || flagStatus === 'submitting') return;
    flagStatus = 'submitting';
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'question',
          subject: 'Question issue report',
          message: flagMessage.trim(),
          questionId: id
        })
      });
      flagStatus = res.ok ? 'sent' : 'error';
    } catch {
      flagStatus = 'error';
    }
  }

  $effect(() => {
    // Reset flag state when the question changes
    questionId;
    flagOpen = false;
    flagMessage = '';
    flagStatus = 'idle';
  });

  interface Props {
    questionId: string;
    // Preloaded question data (e.g. from a parent that already fetched the
    // whole quiz). When it matches questionId, skip the network round trip
    // in getQuestion below.
    question?: PublicQuestion;
    submitHandler: (answer: string) => void;
    // True while the parent is saving the answer, to block repeat submits.
    isSubmitting?: boolean;
  }

  let {
    questionId = $bindable(),
    question: preloadedQuestion,
    submitHandler,
    isSubmitting = false
  }: Props = $props();

  onMount(async () => {
    if (!questionId) {
      questionId = await getRandomQuestionId();
    }
  });

  async function getRandomQuestionId() {
    const response = await fetch('/api/question');
    const data = await response.json();
    if (response.ok) {
      return data.id;
    } else {
      throw new Error(data);
    }
  }

  async function getQuestion(questionId: string): Promise<PublicQuestion> {
    const response = await fetch(`/api/question/${questionId}`);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data);
    }
  }

  function parseMultipleChoiceOptions(options: string): ParsedMultipleChoiceOptions[] {
    return JSON.parse(options).map((option: string) => ({
      label: option,
      value: option
    }));
  }

  const haveAnswer = (answer: string) => {
    return answer !== '';
  };

  $effect(() => {
    if (!questionId) return;

    // Only questionId drives this effect. Reading the preload untracked means a
    // fresh copy of the same question (e.g. page data reloading) doesn't clear
    // the answer in progress.
    const preloaded = untrack(() => preloadedQuestion);
    const source =
      preloaded?.id === questionId ? Promise.resolve(preloaded) : getQuestion(questionId);

    questionPromise = source.then((q) => {
      tick().then(() => containerEl?.querySelector<HTMLElement>('input')?.focus());
      return q;
    });
    answer = '';
  });

  function handleAnswerChange(event: Event) {
    const target = event.target as HTMLInputElement;
    answer = target.value;
  }
</script>

<div class="question-view" bind:this={containerEl}>
  {#await questionPromise}
    <p class="status">Loading question…</p>
  {:then question}
    {#if question}
      <div class="question no-select">
        <form onsubmit={(event) => event.preventDefault()}>
          {#if question.title}
            <p class="question-title">{question.title}</p>
          {/if}
          <h2>{question.prompt}</h2>
          {#if question.type === QuestionType.BlindAnswer}
            <label class="visually-hidden" for="blind-answer">Your answer</label>
            <input
              id="blind-answer"
              class="text-answer"
              type="text"
              placeholder="Enter your answer"
              autocomplete="off"
              onchange={handleAnswerChange}
            />
          {:else if question.type === QuestionType.MultipleChoice}
            <RadioGroup
              label="Answer options"
              options={parseMultipleChoiceOptions(question.multipleChoiceOptions)}
              onchange={handleAnswerChange}
            />
          {:else}
            <p class="status">Not implemented: {question.type}</p>
          {/if}
          <div class="submit-container">
            <Button
              onclick={() => submitHandler(answer)}
              kind="primary"
              disabled={isSubmitting ||
                (question.type !== QuestionType.MultipleChoice && !haveAnswer(answer))}
              >{isSubmitting ? 'Submitting…' : 'Submit'}</Button
            >
          </div>
        </form>

        <div class="flag-section">
          {#if !flagOpen}
            <button class="flag-toggle" onclick={() => (flagOpen = true)}>
              Flag an issue with this question
            </button>
          {:else if flagStatus === 'sent'}
            <p class="flag-sent">Thanks — we'll take a look.</p>
          {:else}
            <div class="flag-form">
              <label for="flag-message" class="flag-label">Describe the issue</label>
              <textarea
                id="flag-message"
                bind:value={flagMessage}
                placeholder="e.g. the answer seems incorrect, wording is confusing…"
                rows="3"
                maxlength="1000"
                disabled={flagStatus === 'submitting'}
              ></textarea>
              {#if flagStatus === 'error'}
                <p class="flag-error">Failed to send. Please try again.</p>
              {/if}
              <div class="flag-actions">
                <Button
                  kind="secondary"
                  disabled={!flagMessage.trim() || flagStatus === 'submitting'}
                  onclick={() => submitFlag(question.id)}
                >
                  {flagStatus === 'submitting' ? 'Sending…' : 'Submit Report'}
                </Button>
                <Button kind="ghost" onclick={() => (flagOpen = false)}>Cancel</Button>
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  {:catch error}
    <p class="status error">{error.message}</p>
  {/await}
</div>

<style>
  .question-view {
    min-height: 250px;
  }

  .status {
    margin: 0;
    color: var(--color-text-muted);
  }

  .status.error {
    color: var(--color-error-text);
  }

  .question-title {
    margin: 0 0 var(--space-xs);
    color: var(--color-link);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 600;
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  h2 {
    margin: 0 0 var(--space-lg);
    font-size: var(--text-2xl);
    line-height: 1.35;
  }

  .text-answer {
    display: block;
    width: 100%;
    padding: 0.75rem 0.875rem;
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-button);
    background-color: var(--color-surface);
    color: var(--color-text);
    font-family: var(--font-mono);
    transition:
      border-color var(--transition-fast),
      box-shadow var(--transition-fast);
  }

  .text-answer:focus-visible {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: var(--focus-ring);
  }

  .submit-container {
    margin-top: var(--space-lg);
  }

  .flag-section {
    margin-top: var(--space-lg);
    padding-top: var(--space-md);
    border-top: 1px solid var(--color-border);
  }

  .flag-toggle {
    padding: 0;
    border: 0;
    background: none;
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
    text-decoration: underline;
    text-underline-offset: 2px;
    cursor: pointer;
  }

  .flag-toggle:hover {
    color: var(--color-text);
  }

  .flag-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .flag-label {
    font-size: var(--text-sm);
    font-weight: 600;
  }

  .flag-form textarea {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-button);
    background-color: var(--color-surface);
    color: var(--color-text);
    font-size: var(--text-sm);
    resize: vertical;
  }

  .flag-form textarea:focus-visible {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: var(--focus-ring);
  }

  .flag-actions {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .flag-sent,
  .flag-error {
    margin: 0;
    font-size: var(--text-sm);
  }

  .flag-sent {
    color: var(--color-success-text);
  }

  .flag-error {
    color: var(--color-error-text);
  }
</style>
