<script lang="ts">
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
  <title>Frontend Challenge Login</title>
  <meta name="description" content="Login for Frontend Challenge" />
</svelte:head>

<main>
  <div>
    <h1>Login</h1>

    {#if errorMessage}
      <ErrorMessage {errorMessage} />
    {/if}

    <form onsubmit={handleSubmit}>
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
      <p>Don't have an account? <a href="/register"> Register here</a></p>
    </form>

    <SocialLoginButtons />
  </div>
</main>

<style>
  main {
    max-width: 400px;
    padding: 10px;
    margin: 0 auto;
  }

  div {
    max-width: 400px;
    margin: 100px auto;
    border: 1px solid #ccc;
    border-radius: var(--card-border-radius);
    padding: 2rem;
  }

  h1 {
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
