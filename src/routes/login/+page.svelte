<!-- FIXME -->
<script lang="ts">
  import AuthTextInput from '$lib/components/AuthTextInput.svelte';
  import Button from '$lib/components/Button.svelte';
  export let form;

  interface ErrorObject {
    email?: string;
    name?: string;
    password?: string;
    other?: string;
  }

  let errorObject: ErrorObject = form?.error || {};
</script>

<svelte:head>
  <title>Frontend Challenge Login</title>
  <meta name="description" content="Login for Frontend Challenge" />
</svelte:head>

<main>
  <div>
    <h1>Login</h1>

    <form method="post">
      <AuthTextInput
        label="Email"
        id="email"
        name="email"
        autocomplete="username"
        error={errorObject?.email}
      />
      <AuthTextInput
        label="Password"
        id="password"
        type="password"
        name="password"
        autocomplete="current-password"
        error={errorObject?.password}
      />
      <Button kind="primary">Login</Button>
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
