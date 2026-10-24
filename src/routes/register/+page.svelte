<script lang="ts">
  import { page } from '$app/state';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import PageContent from '$lib/components/PageContent.svelte';
  import { goto } from '$app/navigation';
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
    const name = String(data.get('name') ?? '');
    const email = String(data.get('email') ?? '');
    const password = String(data.get('password') ?? '');

    loading = true;
    errorMessage = '';
    try {
      const { data, error } = await authClient.signUp.email({ name, email, password });
      if (error) {
        errorMessage = formatAuthError(error.message, 'An error has occurred');
        return;
      }
      // token is null when email verification is required (no session yet);
      // non-null when the server auto-signed in (e.g. verification disabled).
      await goto(data?.token ? '/' : `/verify-email?email=${encodeURIComponent(email)}`);
    } catch {
      errorMessage = 'An error has occurred';
      return;
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Register — Frontend Challenge</title>
  <meta name="description" content="Registration for Frontend Challenge" />
</svelte:head>

<PageContent width="narrow">
  <PageHeader eyebrow="Join for free" title="Registration" align="center">
    <p>Create an account to keep your rating and quiz history.</p>
  </PageHeader>

  <div class="form-card form-stack">
    {#if errorMessage}
      <ErrorMessage {errorMessage} />
    {/if}

    <form class="form-stack" onsubmit={handleSubmit}>
      <AuthTextInput label="Name" id="name" name="name" autocomplete="name" />
      <AuthTextInput label="Email" id="email" type="email" name="email" autocomplete="email" />
      <AuthTextInput
        label="Password"
        id="password"
        type="password"
        name="password"
        autocomplete="new-password"
      />
      <Button type="submit" kind="primary" disabled={loading}>Register</Button>
    </form>
    <p class="form-footnote">Already have an account? <a href="/login">Login here</a></p>

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
