<script lang="ts">
  import AuthTextInput from '$lib/components/auth/AuthTextInput.svelte';
  import Button from '$lib/components/Button.svelte';
  let { form } = $props();

  interface ErrorObject {
    email?: string;
    name?: string;
    password?: string;
    other?: string;
  }

  let errorObject: ErrorObject = form?.error || {}; //TODO fix error handling on registration form
</script>

<svelte:head>
  <title>Frontend Challenge Register</title>
  <meta name="description" content="Registration for Frontend Challenge" />
</svelte:head>

<main>
  <h1>Registration</h1>

  {#if errorObject?.other}
    <p class="error">{errorObject.other}</p>
  {/if}

  <form method="post">
    <AuthTextInput
      label="Name"
      id="name"
      name="name"
      autocomplete="name"
      error={errorObject?.name}
    />
    <AuthTextInput
      label="Email"
      id="email"
      type="email"
      name="email"
      autocomplete="email"
      error={errorObject?.email}
    />
    <AuthTextInput
      label="Password"
      id="password"
      type="password"
      name="password"
      autocomplete="new-password"
      error={errorObject?.password}
    />
    <Button type="submit" kind="primary">Register</Button>
    <p>Already have an account? <a href="/login">Login here</a></p>
  </form>
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

  .error {
    color: red;
  }
</style>
