<script lang="ts">
  import { page } from '$app/state';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import PageContent from '$lib/components/PageContent.svelte';
  import { goto, invalidateAll } from '$app/navigation';
  import { authClient, formatAuthError } from '$lib/auth-client';
  import AuthTextInput from '$lib/components/auth/AuthTextInput.svelte';
  import SocialLoginButtons from '$lib/components/auth/SocialLoginButtons.svelte';
  import Button from '$lib/components/Button.svelte';
  import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';

  let errorMessage = $state('');
  let loading = $state(false);

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const data = new FormData(event.currentTarget as HTMLFormElement);
    const email = String(data.get('email') ?? '');
    const password = String(data.get('password') ?? '');

    loading = true;
    errorMessage = '';
    try {
      const { error } = await authClient.signIn.email({ email, password });
      if (error) {
        if (error.code === 'EMAIL_NOT_VERIFIED') {
          await goto(`/verify-email?email=${encodeURIComponent(email)}`);
          return;
        }
        errorMessage = formatAuthError(error.message, 'Incorrect email or password');
        return;
      }
    } catch {
      errorMessage = 'Incorrect email or password';
      return;
    } finally {
      loading = false;
    }

    await invalidateAll();
    await goto('/');
  }
</script>

<svelte:head>
  <title>Login — Frontend Challenge</title>
  <meta name="description" content="Login for Frontend Challenge" />
</svelte:head>

<PageContent width="narrow">
  <PageHeader eyebrow="Welcome back" title="Login" align="center">
    <p>Sign in to keep your rating and quiz history.</p>
  </PageHeader>

  <div class="form-card form-stack">
    {#if errorMessage}
      <ErrorMessage {errorMessage} />
    {/if}

    <form class="form-stack" onsubmit={handleSubmit}>
      <AuthTextInput label="Email" id="email" name="email" autocomplete="username" error="" />
      <AuthTextInput
        label="Password"
        id="password"
        type="password"
        name="password"
        autocomplete="current-password"
        error=""
      />
      <Button kind="primary" type="submit" disabled={loading}>Login</Button>
    </form>
    <p class="form-footnote">Don't have an account? <a href="/register">Register here</a></p>

    {#if page.data.socialProviders?.length}
      <div class="form-divider">or</div>
      <SocialLoginButtons />
    {/if}
  </div>
</PageContent>

<style>
  .form-card :global(.c-button) {
    width: 100%;
  }
</style>
