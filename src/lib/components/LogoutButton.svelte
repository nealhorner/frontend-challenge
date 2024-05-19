<script>
  import Button from './Button.svelte';

  const handleClick = () => {
    alert('Logout');
    console.log('Logout');
  };
</script>

<Button kind="primary" on:click={handleClick}>Logout</Button>
