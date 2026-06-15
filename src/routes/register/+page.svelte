<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation';
  import { authClient } from '$lib/auth-client';
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
    const { error } = await authClient.signUp.email({ name, email, password });
    loading = false;

    if (error) {
      errorMessage = error.message || 'An error has occurred';
      return;
    }

    await invalidateAll();
    await goto('/');
  }
</script>

<svelte:head>
  <title>Frontend Challenge Register</title>
  <meta name="description" content="Registration for Frontend Challenge" />
</svelte:head>

<main>
  <h1>Registration</h1>

  {#if errorMessage}
    <ErrorMessage {errorMessage} />
  {/if}

  <form onsubmit={handleSubmit}>
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
    <p>Already have an account? <a href="/login">Login here</a></p>
  </form>

  <SocialLoginButtons />
</main>

<style>
  main {
    max-width: 400px;
    margin: 100px auto;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 4px;
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
