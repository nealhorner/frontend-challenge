<script lang="ts">
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
  <title>Verify your email – Frontend Challenge</title>
</svelte:head>

<main>
  <div class="card">
    <h1>Check your email</h1>
    <p>
      We sent a verification link to
      {#if data.email}
        <strong>{data.email}</strong>
      {:else}
        your email address
      {/if}. Click the link to activate your account.
    </p>
    <p class="hint">Don't see it? Check your spam folder.</p>

    {#if data.email}
      <div class="resend">
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
          {resendStatus === 'sending' ? 'Sending…' : 'Resend verification email'}
        </Button>
      </div>
    {/if}

    <p class="back"><a href="/login">Back to login</a></p>
  </div>
</main>

<style>
  main {
    max-width: 400px;
    margin: 100px auto;
    padding: 0 1rem;
  }

  .card {
    border: 1px solid var(--ocean-color-mist-light);
    border-radius: var(--card-border-radius);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  h1 {
    text-align: center;
    margin: 0;
  }

  p {
    margin: 0;
  }

  .hint {
    color: var(--ocean-color-mist-dark, #666);
    font-size: 0.875rem;
  }

  .resend {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .success {
    color: green;
    font-size: 0.875rem;
  }

  .error {
    color: red;
    font-size: 0.875rem;
  }

  .back {
    text-align: center;
    font-size: 0.875rem;
  }
</style>
