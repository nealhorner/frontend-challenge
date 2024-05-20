<!-- FIXME -->
<script>
  import Button from '$lib/components/Button.svelte';

  let email = '';
  let password = '';

  function handleLogin() {
    // Add your login logic here
    console.log('Logging in...');
  }
</script>

<svelte:head>
  <title>Frontend Challenge Login</title>
  <meta name="description" content="Login for Frontend Challenge" />
</svelte:head>

<main>
  <h1>Login</h1>

  <form id="fromLogin" on:submit|preventDefault={handleLogin}>
    <label for="email">Email:</label>
    <input type="email" id="email" autocomplete="username" bind:value={email} required />

    <label for="password">Password:</label>
    <input
      type="password"
      id="password"
      autocomplete="current-password"
      bind:value={password}
      required
    />
    <Button kind="primary">Login</Button>
    <p>Don't have an account? <a href="/register"> Register here</a></p>
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

  label {
    font-weight: bold;
  }

  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: var(--color-blue);
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>
