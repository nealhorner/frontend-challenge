<script>
  import Button from '../Button.svelte';
  async function logout() {
    await fetch('/logout', { method: 'POST' });
    window.location.href = '/login';
  }
</script>

<Button kind="ghost" onclick={logout}>Logout</Button>
