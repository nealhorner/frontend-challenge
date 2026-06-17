<script lang="ts">
  import { onMount, tick } from 'svelte';
  import Button from './Button.svelte';
  import RadioGroup from './RadioGroup.svelte';
  import { QuestionType, type ParsedMultipleChoiceOptions, type Question } from '$lib/types';

  let answer = $state('');
  let questionPromise: Promise<Question> | undefined = $state();
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
    submitHandler: (answer: string) => void;
  }

  let { questionId = $bindable(), submitHandler }: Props = $props();

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

  async function getQuestion(questionId: string) {
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
    if (questionId) {
      questionPromise = getQuestion(questionId).then((q) => {
        tick().then(() => containerEl?.querySelector<HTMLElement>('input')?.focus());
        return q;
      });
      answer = '';
    }
  });

  function handleAnswerChange(event: Event) {
    const target = event.target as HTMLInputElement;
    answer = target.value;
  }
</script>

<main bind:this={containerEl}>
  {#await questionPromise}
    <p>...waiting</p>
  {:then question}
    {#if question}
      <div class="question no-select">
        <form>
          {#if question.title}
            <p id="question-title">{question.title}</p>
          {/if}
          <h2>{question.prompt}</h2>
          {#if question.type === QuestionType.BlindAnswer}
            <input type="text" placeholder="Enter your answer" onchange={handleAnswerChange} />
          {:else if question.type === QuestionType.MultipleChoice}
            <RadioGroup
              label="label"
              options={parseMultipleChoiceOptions(question.multipleChoiceOptions)}
              onchange={handleAnswerChange}
            />
          {:else}
            <p>No Implemented: {question.type}</p>
          {/if}
          <div class="submit-container">
            <Button
              onclick={() => submitHandler(answer)}
              kind="secondary"
              disabled={question.type !== QuestionType.MultipleChoice && !haveAnswer(answer)}
              >Submit</Button
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
                <button class="flag-cancel" onclick={() => (flagOpen = false)}>Cancel</button>
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</main>

<style>
  main {
    text-align: center;
    min-height: 250px;
  }

  #question-title {
    color: #888;
    margin: 5px 0px;
  }

  h2 {
    font-size: 1.5rem;
    margin-top: 0px;
    margin-bottom: 1rem;
  }

  .question {
    text-align: left;
  }

  .submit-container {
    margin: 15px 0px;
  }

  .flag-section {
    margin-top: 1.5rem;
    border-top: 1px solid var(--color-border, #e5e7eb);
    padding-top: 0.75rem;
  }

  .flag-toggle {
    background: none;
    border: none;
    padding: 0;
    font-size: 0.8rem;
    color: var(--color-text-secondary, #666);
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .flag-toggle:hover {
    color: var(--color-text, #111);
  }

  .flag-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .flag-label {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .flag-form textarea {
    padding: 0.4rem 0.5rem;
    border: 1px solid var(--ocean-color-mist-light);
    border-radius: 4px;
    font-size: 0.9rem;
    font-family: inherit;
    resize: vertical;
    box-sizing: border-box;
    width: 100%;
  }

  .flag-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .flag-cancel {
    background: none;
    border: none;
    padding: 0;
    font-size: 0.85rem;
    color: var(--color-text-secondary, #666);
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .flag-sent,
  .flag-error {
    font-size: 0.85rem;
    margin: 0;
  }

  .flag-sent {
    color: var(--color-affirmative-dark, green);
  }

  .flag-error {
    color: var(--ocean-color-red-sun, red);
  }
</style>
