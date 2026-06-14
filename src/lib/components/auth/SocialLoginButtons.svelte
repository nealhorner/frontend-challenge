<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { authClient } from '$lib/auth-client';

  type Provider = 'github' | 'google';

  let loadingProvider = $state<Provider | null>(null);

  async function signInWith(provider: Provider) {
    loadingProvider = provider;
    await authClient.signIn.social({ provider, callbackURL: '/' });
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
    Continue with GitHub
  </Button>
  <Button
    kind="secondary"
    type="button"
    data-provider="google"
    disabled={loadingProvider !== null}
    onclick={() => signInWith('google')}
  >
    Continue with Google
  </Button>
</div>

<style>
  .social-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
  }
</style>
