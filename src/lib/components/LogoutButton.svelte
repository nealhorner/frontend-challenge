<script>
  import Button from './Button.svelte';

  const handleClick = () => {
    alert('Logout');
    console.log('Logout');
  };
</script>

<Button type="primary" text="Logout" on:click={handleClick}></Button>
