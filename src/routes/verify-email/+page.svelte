<script lang="ts">
  import PageHeader from '$lib/components/PageHeader.svelte';
  import PageContent from '$lib/components/PageContent.svelte';
  import { authClient } from '$lib/auth-client';
  import Button from '$lib/components/Button.svelte';

  let { data } = $props();

  let resendStatus = $state<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function resend() {
    if (!data.email || resendStatus === 'sending') return;
    resendStatus = 'sending';
    try {
      const { error } = await authClient.sendVerificationEmail({ email: data.email });
      resendStatus = error ? 'error' : 'sent';
    } catch {
      resendStatus = 'error';
    }
  }
</script>

<svelte:head>
  <title>Verify your email — Frontend Challenge</title>
</svelte:head>

<PageContent width="narrow">
  <PageHeader eyebrow="Almost there" title="Check your email" align="center" />

  <div class="form-card form-stack">
    <p class="intro">
      We sent a verification link to
      {#if data.email}
        <strong>{data.email}</strong>
      {:else}
        your email address
      {/if}. Click the link to activate your account.
    </p>
    <p class="hint">Don't see it? Check your spam folder.</p>

    {#if data.email}
      <div class="resend form-stack">
        {#if resendStatus === 'sent'}
          <p class="success">Verification email resent.</p>
        {:else if resendStatus === 'error'}
          <p class="error">Failed to resend. Please try again.</p>
        {/if}
        <Button
          kind="secondary"
          disabled={resendStatus === 'sending' || resendStatus === 'sent'}
          onclick={resend}
        >
          {resendStatus === 'sending' ? 'Sending…' : 'Resend Verification Email'}
        </Button>
      </div>
    {/if}

    <p class="form-footnote"><a href="/login">Back to login</a></p>
  </div>
</PageContent>

<style>
  p {
    margin: 0;
  }

  .intro {
    color: var(--color-text);
    overflow-wrap: anywhere;
  }

  .hint {
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
  }

  .resend {
    padding-top: var(--space-md);
    border-top: 1px solid var(--color-border);
  }

  .resend :global(.c-button) {
    width: 100%;
  }

  .success {
    color: var(--color-success-text);
    font-size: var(--text-sm);
  }

  .error {
    color: var(--color-error-text);
    font-size: var(--text-sm);
  }
</style>
