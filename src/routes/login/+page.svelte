<script lang="ts">
  import AuthTextInput from '$lib/components/auth/AuthTextInput.svelte';
  import Button from '$lib/components/Button.svelte';
  import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';

  interface Props {
    form: HTMLFormElement;
  }

  let { form }: Props = $props();
</script>

<svelte:head>
  <title>Frontend Challenge Login</title>
  <meta name="description" content="Login for Frontend Challenge" />
</svelte:head>

<main>
  <div>
    <h1>Login</h1>

    {#if form?.loginError}
      <ErrorMessage errorMessage={form.message} />
    {/if}

    <form method="post" action="?/login">
      <AuthTextInput label="Email" id="email" name="email" autocomplete="username" error="" />
      <AuthTextInput
        label="Password"
        id="password"
        type="password"
        name="password"
        autocomplete="current-password"
        error=""
      />
      <Button kind="primary" type="submit">Login</Button>
      <p>Don't have an account? <a href="/register"> Register here</a></p>
    </form>
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
