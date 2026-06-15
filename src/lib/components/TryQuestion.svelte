<script lang="ts">
  import ButtonLink from './ButtonLink.svelte';

  // A curated sample question so visitors can experience the core loop
  // instantly, without an account or an API round-trip.
  const question = {
    tag: 'CSS',
    prompt: 'Which CSS selector targets all paragraph tags?',
    options: ['p', '.p', '#p', '*p'],
    answer: 'p'
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
</script>

<section class="try">
  <p class="eyebrow">Try one right now — no account needed</p>
  <div class="card">
    <span class="tag">{question.tag}</span>
    <p class="prompt">{question.prompt}</p>
    <div class="options" role="group" aria-label="Answer options">
      {#each question.options as option (option)}
        <button
          type="button"
          class="option {stateFor(option)}"
          aria-pressed={selected === option}
          disabled={answered && stateFor(option) === 'idle'}
          onclick={() => choose(option)}
        >
          <code>{option}</code>
        </button>
      {/each}
    </div>

    {#if answered}
      <div class="feedback {correct ? 'correct' : 'incorrect'}" role="status">
        {#if correct}
          <p>Correct! That's how it feels — instant feedback on every question.</p>
        {:else}
          <p>Not quite — <code>p</code> is the answer. Start a quiz to keep going.</p>
        {/if}
        <ButtonLink href="/quiz" kind="primary">Start a Quiz</ButtonLink>
      </div>
    {/if}
  </div>
</section>

<style>
  .try {
    background-color: white;
    padding: 48px var(--page-content-padding);
  }
  .eyebrow {
    text-align: center;
    font-size: 0.8rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
    margin: 0 0 16px;
  }
  .card {
    max-width: 560px;
    margin: 0 auto;
    border: 1px solid var(--color-border);
    border-radius: var(--card-border-radius);
    padding: 24px;
  }
  .tag {
    display: inline-block;
    background-color: var(--color-negative-light);
    color: var(--color-pink);
    font-size: 0.75rem;
    padding: 3px 10px;
    border-radius: 999px;
    margin-bottom: 12px;
  }
  .prompt {
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--color-text);
    margin: 0 0 16px;
  }
  .options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .option {
    text-align: left;
    padding: 12px 14px;
    border-radius: var(--border-radius-md);
    border: 1px solid var(--color-border);
    background-color: white;
    cursor: pointer;
    transition: all 150ms ease-out;
  }
  .option code {
    font-family: var(--font-mono);
    font-size: 0.95rem;
  }
  .option:hover:enabled {
    border-color: var(--color-purple);
  }
  .option:disabled {
    cursor: default;
    opacity: 0.55;
  }
  .option.correct {
    background-color: var(--color-affirmative-light);
    border-color: var(--color-affirmative-dark);
    opacity: 1;
  }
  .option.correct code {
    color: var(--color-affirmative-dark);
  }
  .option.incorrect {
    background-color: var(--color-negative-light);
    border-color: var(--color-negative-dark);
    opacity: 1;
  }
  .option.incorrect code {
    color: var(--color-negative-dark);
  }
  .feedback {
    margin-top: 18px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .feedback p {
    margin: 0;
    font-size: 0.95rem;
  }
  .feedback.correct p {
    color: var(--color-affirmative-dark);
  }
  .feedback.incorrect p {
    color: var(--color-negative-dark);
  }
  .feedback code {
    font-family: var(--font-mono);
  }

  @media (max-width: 480px) {
    .try {
      padding: 40px 20px;
    }
    .options {
      grid-template-columns: 1fr;
    }
  }
</style>
