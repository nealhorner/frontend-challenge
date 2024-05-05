<script>
  let email = '';
  let username = '';

  function saveProfile() {
    // Here you can implement the logic to save the profile data
    // For example, you can make an API call to store the data on the server
    console.log('Email:', email);
    console.log('Username:', username);
  }
</script>

<main>
  <h1>Private Profile</h1>

  <form on:submit|preventDefault={saveProfile}>
    <label for="email">Email:</label>
    <input type="email" id="email" bind:value={email} required />

    <label for="username">Username:</label>
    <input type="text" id="username" bind:value={username} required />

    <button type="submit">Save</button>
  </form>
</main>

<style>
  /* Add your custom styles here */
</style>
