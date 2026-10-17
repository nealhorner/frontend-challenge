<script lang="ts">
  import ButtonLink from './ButtonLink.svelte';
  import IconCheckCircle from '~icons/mdi/check-circle-outline';
  import IconCloseCircle from '~icons/mdi/close-circle-outline';
  import IconConsole from '~icons/mdi/console';
  import IconVerified from '~icons/mdi/check-decagram';

  // A curated sample question so visitors can experience the core loop
  // instantly, without an account or an API round-trip.
  const question = {
    tag: 'CSS',
    file: 'challenge_01.css',
    prompt: 'Which CSS selector targets all paragraph tags?',
    options: ['p', '.p', '#p', '*p'],
    answer: 'p',
    concept: 'Type selector'
  };

  let selected = $state<string | null>(null);
  let answered = $derived(selected !== null);
  let correct = $derived(selected === question.answer);

  function choose(option: string) {
    if (answered) return;
    selected = option;
  }

  function stateFor(option: string): 'correct' | 'incorrect' | 'idle' {
    if (!answered) return 'idle';
    if (option === question.answer) return 'correct';
    if (option === selected) return 'incorrect';
    return 'idle';
  }

  // Number keys 1–4 pick an answer, matching the [1]–[4] hints.
  function onKeydown(event: KeyboardEvent) {
    if (answered || event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as HTMLElement;
    if (target.closest('input, textarea, select, [contenteditable]')) return;
    const option = question.options[Number(event.key) - 1];
    if (option) choose(option);
  }
</script>

<svelte:window onkeydown={onKeydown} />

<section class="try" aria-labelledby="try-heading">
  <div class="eyebrow">
    <IconConsole />
    <span>Try one right now — no account needed</span>
  </div>

  <div class="window">
    <div class="window-bar">
      <span class="dots" aria-hidden="true"><span></span><span></span><span></span></span>
      <span class="file">{question.file}</span>
      <span class="tag">{question.tag}</span>
    </div>

    <div class="body">
      <h2 id="try-heading" class="prompt">{question.prompt}</h2>

      <div class="options" role="group" aria-label="Answer options">
        {#each question.options as option, i (option)}
          {@const state = stateFor(option)}
          <button
            type="button"
            class="option {state}"
            aria-pressed={selected === option}
            aria-keyshortcuts={String(i + 1)}
            disabled={answered && state === 'idle'}
            onclick={() => choose(option)}
          >
            <span class="key" aria-hidden="true">
              {#if state === 'correct'}<IconCheckCircle
                />{:else if state === 'incorrect'}<IconCloseCircle />{:else}[{i + 1}]{/if}
            </span>
            <code>{option}</code>
          </button>
        {/each}
      </div>

      {#if answered}
        <div class="feedback {correct ? 'correct' : 'incorrect'}" role="status">
          {#if correct}
            <IconVerified class="feedback-icon" />
          {:else}
            <IconCloseCircle class="feedback-icon" />
          {/if}
          <div class="feedback-body">
            <p class="feedback-title">
              <span>{correct ? 'Correct answer' : 'Not quite'}</span>
              <span class="concept">{question.concept}</span>
            </p>
            <p>
              <code>p</code> targets every <code>&lt;p&gt;</code> element on the page. Tag selectors
              don't use a prefix like a dot (<code>.</code>) for classes or a hash (<code>#</code>)
              for IDs.
            </p>
            <ButtonLink href="/quiz" kind="primary">Start a Quiz</ButtonLink>
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  .try {
    max-width: 48rem;
    margin: 0 auto;
    padding: var(--space-xl) var(--page-content-padding) var(--space-2xl);
    box-sizing: content-box;
  }

  .eyebrow {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin: 0 0 var(--space-sm) var(--space-xs);
    color: var(--color-link);
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .eyebrow :global(svg) {
    font-size: 1.125rem;
  }

  .window {
    overflow: hidden;
    border: 1px solid var(--color-border-card);
    border-radius: var(--radius-card);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-overlay);
  }

  .window-bar {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    border-bottom: 1px solid var(--color-border-card);
    background-color: var(--color-surface-sunken);
  }

  .dots {
    display: inline-flex;
    gap: 0.375rem;
  }

  .dots span {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: var(--radius-full);
    background-color: #ef4444;
  }

  .dots span:nth-child(2) {
    background-color: #f59e0b;
  }

  .dots span:nth-child(3) {
    background-color: #10b981;
  }

  .file {
    margin-left: var(--space-xs);
    color: var(--color-text-secondary);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
  }

  .tag {
    margin-left: auto;
    padding: 0.125rem var(--space-sm);
    border-radius: var(--radius-full);
    background-color: var(--topic-rose-bg);
    color: var(--topic-rose-text);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: var(--tracking-wide);
  }

  .body {
    padding: var(--space-xl);
  }

  .prompt {
    margin: 0;
    font-size: var(--text-xl);
    line-height: 1.4;
  }

  .options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-sm);
    margin-top: var(--space-lg);
  }

  .option {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-button);
    background-color: var(--color-surface-sunken);
    color: var(--color-text);
    text-align: left;
    cursor: pointer;
    transition:
      border-color var(--transition-fast),
      background-color var(--transition-fast),
      box-shadow var(--transition-fast);
  }

  .option:hover:enabled {
    border-color: var(--color-primary-border);
    background-color: var(--color-surface-raised);
  }

  .option:focus-visible {
    outline: none;
    box-shadow: var(--focus-ring);
  }

  .option:disabled {
    cursor: default;
    opacity: 0.5;
  }

  .key {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    padding: 0.125rem 0.375rem;
    border-radius: var(--radius-sm);
    background-color: var(--color-surface);
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 600;
  }

  /* Plain mono text, not the global inline-code badge */
  .option code {
    padding: 0;
    border: 0;
    background: none;
    font-size: var(--text-sm);
    font-weight: 600;
  }

  .option.correct {
    border-color: var(--color-success);
    background-color: var(--color-success-soft);
    opacity: 1;
  }

  .option.correct .key,
  .option.correct code {
    color: var(--color-success-text);
  }

  .option.incorrect {
    border-color: var(--color-error);
    background-color: var(--color-error-soft);
    opacity: 1;
  }

  .option.incorrect .key,
  .option.incorrect code {
    color: var(--color-error-text);
  }

  .option.correct .key,
  .option.incorrect .key {
    background-color: transparent;
    font-size: 1.125rem;
  }

  .feedback {
    display: flex;
    align-items: flex-start;
    gap: var(--space-sm);
    margin-top: var(--space-md);
    padding: var(--space-md);
    border: 1px solid;
    border-radius: var(--radius-button);
  }

  .feedback.correct {
    border-color: var(--color-success);
    background-color: var(--color-success-soft);
    --feedback-color: var(--color-success-text);
  }

  .feedback.incorrect {
    border-color: var(--color-error);
    background-color: var(--color-error-soft);
    --feedback-color: var(--color-error-text);
  }

  .feedback :global(.feedback-icon) {
    flex-shrink: 0;
    margin-top: 0.125rem;
    color: var(--feedback-color);
    font-size: 1.25rem;
  }

  .feedback-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .feedback p {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
  }

  .feedback .feedback-title {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--space-sm);
    color: var(--feedback-color);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .concept {
    color: var(--color-text-muted);
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
  }

  @media (max-width: 600px) {
    .body {
      padding: var(--space-lg);
    }

    .options {
      grid-template-columns: 1fr;
    }
  }
</style>
