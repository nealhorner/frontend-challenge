<script lang="ts">
  import AuthTextInput from '$lib/components/AuthTextInput.svelte';
  export let form;

  // Todo - Add client side form validation
</script>

<main>
  <h1>Registration</h1>

  {#if form?.error}
    <p class="error">{form?.error?.name}</p>
    <p class="error">{form?.error?.email}</p>
    <p class="error">{form?.error?.password}</p>
  {/if}

  <form method="post">
    <AuthTextInput label="Name" id="name" name="name" autocomplete="name" error="" />

    <AuthTextInput
      label="Email"
      id="email"
      name="email"
      autocomplete="email"
      error={form?.error?.email}
    />

    <!-- <label for="email">Email:</label>
    <input type="email" id="email" name="email" autocomplete="username" required /> -->

    <label for="password">Password:</label>
    <input type="password" id="password" name="password" autocomplete="new-password" required />

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

  .error {
    color: red;
    font-weight: bold;
  }
</style>
