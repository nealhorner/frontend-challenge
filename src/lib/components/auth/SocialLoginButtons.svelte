<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { authClient } from '$lib/auth-client';
  import IconGithub from '~icons/mdi/github';
  import IconGoogle from '~icons/mdi/google';

  type Provider = 'github' | 'google';

  let loadingProvider = $state<Provider | null>(null);

  async function signInWith(provider: Provider) {
    loadingProvider = provider;
    try {
      const { error } = await authClient.signIn.social({ provider, callbackURL: '/' });
      // On success the browser is redirected to the provider and this page
      // unloads; only reset (re-enable the buttons) if it didn't redirect.
      if (error) loadingProvider = null;
    } catch (err) {
      console.error('Social sign-in error:', err);
      loadingProvider = null;
    }
  }
</script>

<div class="social-buttons">
  <Button
    kind="secondary"
    type="button"
    data-provider="github"
    disabled={loadingProvider !== null}
    onclick={() => signInWith('github')}
  >
    <IconGithub aria-hidden="true" />Continue with GitHub
  </Button>
  <Button
    kind="secondary"
    type="button"
    data-provider="google"
    disabled={loadingProvider !== null}
    onclick={() => signInWith('google')}
  >
    <IconGoogle aria-hidden="true" />Continue with Google
  </Button>
</div>

<style>
  .social-buttons {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .social-buttons :global(.c-button) {
    width: 100%;
  }
</style>
