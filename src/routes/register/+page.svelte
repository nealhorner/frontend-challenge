<script lang="ts">
  import AuthTextInput from '$lib/components/AuthTextInput.svelte';
  export let form;

  // Todo - Add client side form validation

  interface ErrorObject {
    email?: string;
    name?: string;
    password?: string;
    other?: string;
  }

  let errorObject: ErrorObject = form?.error || {};
</script>

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
    <button type="submit">Register</button>
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

  button {
    padding: 0.5rem 1rem;
    background-color: var(--color-blue);
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .error {
    color: red;
  }
</style>
