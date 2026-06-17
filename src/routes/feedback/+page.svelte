<script lang="ts">
  import { untrack } from 'svelte';
  import Button from '$lib/components/Button.svelte';

  let { data } = $props();
  const { initialType, initialQuestionId, userEmail } = untrack(() => data);

  let type = $state<'general' | 'bug' | 'question'>(initialType);
  let subject = $state('');
  let message = $state('');
  let replyTo = $state(userEmail ?? '');
  let questionId = $state(initialQuestionId);

  let status = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');
  let errorMessage = $state('');

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    status = 'submitting';
    errorMessage = '';

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          subject,
          message,
          replyTo,
          questionId: questionId || undefined
        })
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        errorMessage = body.error ?? 'Something went wrong. Please try again.';
        status = 'error';
        return;
      }

      status = 'success';
    } catch {
      errorMessage = 'Something went wrong. Please try again.';
      status = 'error';
    }
  }
</script>

<svelte:head>
  <title>Feedback – Frontend Challenge</title>
  <meta name="description" content="Send feedback, report bugs, or flag quiz questions." />
</svelte:head>

<main>
  <div class="card">
    <h1>Send Feedback</h1>

    {#if status === 'success'}
      <div class="success">
        <p>Thanks — your feedback has been sent!</p>
        <a href="/">Back to home</a>
      </div>
    {:else}
      <form onsubmit={handleSubmit}>
        <div class="field">
          <label for="type">Type</label>
          <select id="type" bind:value={type} required>
            <option value="general">General Feedback</option>
            <option value="bug">Bug Report</option>
            <option value="question">Question Issue</option>
          </select>
        </div>

        {#if type === 'question'}
          <div class="field">
            <label for="questionId">Question ID</label>
            <input
              id="questionId"
              type="text"
              bind:value={questionId}
              placeholder="Paste the question ID here"
            />
          </div>
        {/if}

        <div class="field">
          <label for="subject">Subject</label>
          <input
            id="subject"
            type="text"
            bind:value={subject}
            placeholder="Brief description"
            maxlength="200"
            required
          />
        </div>

        <div class="field">
          <label for="message">Message</label>
          <textarea
            id="message"
            bind:value={message}
            placeholder="Tell us more…"
            maxlength="5000"
            rows="6"
            required
          ></textarea>
        </div>

        <div class="field">
          <label for="replyTo"
            >Your email <span class="optional">(optional — for follow-up)</span></label
          >
          <input id="replyTo" type="email" bind:value={replyTo} placeholder="you@example.com" />
        </div>

        {#if status === 'error'}
          <p class="error">{errorMessage}</p>
        {/if}

        <Button kind="primary" type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Send Feedback'}
        </Button>
      </form>
    {/if}
  </div>
</main>

<style>
  main {
    max-width: 560px;
    margin: 60px auto;
    padding: 0 1rem;
  }

  .card {
    border: 1px solid var(--ocean-color-mist-light);
    border-radius: var(--card-border-radius);
    padding: 2rem;
  }

  h1 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  label {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .optional {
    font-weight: 400;
    color: var(--color-text-secondary, #666);
  }

  input,
  select,
  textarea {
    padding: 0.5rem;
    border: 1px solid var(--ocean-color-mist-light);
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;
    box-sizing: border-box;
    width: 100%;
  }

  textarea {
    resize: vertical;
  }

  .error {
    color: var(--ocean-color-red-sun, red);
    margin: 0;
    font-size: 0.9rem;
  }

  .success {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem 0;
    text-align: center;
  }

  .success p {
    font-size: 1.1rem;
    margin: 0;
  }

  .success a {
    color: var(--color-purple);
  }
</style>
