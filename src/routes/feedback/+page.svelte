<script lang="ts">
  import PageHeader from '$lib/components/PageHeader.svelte';
  import PageContent from '$lib/components/PageContent.svelte';
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
  <title>Feedback — Frontend Challenge</title>
  <meta name="description" content="Send feedback, report bugs, or flag quiz questions." />
</svelte:head>

<PageContent width="medium">
  <div class="column">
    <PageHeader eyebrow="Help us improve" title="Send Feedback">
      <p>
        Ideas, bugs, or a question that looks wrong: send us a feedback email. Every note will be
        eventually read.
      </p>
    </PageHeader>

    <div class="form-card">
      {#if status === 'success'}
        <div class="success" role="status">
          <p>Thanks — your feedback has been sent!</p>
          <a href="/">Back to home</a>
        </div>
      {:else}
        <form class="form-stack" onsubmit={handleSubmit}>
          <div class="form-field">
            <label for="type">Type</label>
            <select id="type" class="form-input" bind:value={type} required>
              <option value="general">General Feedback</option>
              <option value="bug">Bug Report</option>
              <option value="question">Question Issue</option>
            </select>
          </div>

          {#if type === 'question'}
            <div class="form-field">
              <label for="questionId">Question ID</label>
              <input
                id="questionId"
                class="form-input"
                type="text"
                bind:value={questionId}
                placeholder="Paste the question ID here"
              />
            </div>
          {/if}

          <div class="form-field">
            <label for="subject">Subject</label>
            <input
              id="subject"
              class="form-input"
              type="text"
              bind:value={subject}
              placeholder="Brief description"
              maxlength="200"
              required
            />
          </div>

          <div class="form-field">
            <label for="message">Message</label>
            <textarea
              id="message"
              class="form-input"
              bind:value={message}
              placeholder="Tell us more…"
              maxlength="5000"
              rows="6"
              required
            ></textarea>
          </div>

          <div class="form-field">
            <label for="replyTo"
              >Your email <span class="form-hint">(optional — for follow-up)</span></label
            >
            <input
              id="replyTo"
              class="form-input"
              type="email"
              bind:value={replyTo}
              placeholder="you@example.com"
            />
          </div>

          {#if status === 'error'}
            <p class="error">{errorMessage}</p>
          {/if}

          <div>
            <Button kind="primary" type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Sending…' : 'Send Feedback'}
            </Button>
          </div>
        </form>
      {/if}
    </div>
  </div>
</PageContent>

<style>
  .column {
    max-width: 38rem;
  }

  .success {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .success p {
    margin: 0;
    color: var(--color-success-text);
    font-weight: 600;
  }

  .error {
    margin: 0;
    color: var(--color-error-text);
    font-size: var(--text-sm);
  }
</style>
