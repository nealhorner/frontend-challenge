<script>
  export let type = 'primary';
  export let text = 'Button';
  export let onClick = () => {};

  let buttonClass = '';

  // Set the button class based on the type prop
  $: {
    if (type === 'primary') {
      buttonClass = 'primary-button';
    } else if (type === 'secondary') {
      buttonClass = 'secondary-button';
    } else if (type === 'warning') {
      buttonClass = 'warning-button';
    } else if (type === 'accept') {
      buttonClass = 'accept-button';
    }
  }
</script>

<button class="button {buttonClass} noselect" on:click={onClick}>{text}</button>

<style>
  .button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: bold;
    text-transform: uppercase;
    outline: none;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .button:hover {
    text-decoration: underline;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  .button:active {
    transform: translateY(1px);
    box-shadow: none;
  }
  .primary-button {
    /* Primary button styles */
    background-color: var(--color-purple);
    color: white;
  }

  .secondary-button {
    /* Secondary button styles */
    background-color: white;
    color: var(--color-blue);
  }

  .warning-button {
    /* Warning button styles */
    background-color: red;
    color: white;
  }

  .accept-button {
    /* Accept button styles */
    background-color: green;
    color: white;
  }
</style>
