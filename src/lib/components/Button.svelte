<script lang="ts">
  type Kind = 'primary' | 'secondary' | 'warning' | 'accept';
  type Type = 'button' | 'submit' | 'reset';

  export let kind: Kind = 'primary';
  export let disabled: boolean = false;
  export let type: Type = 'button';

  $: buttonProps = {
    type,
    disabled,
    class: ['no-select', kind && `c-button-${kind}`].filter(Boolean).join(' ')
  };
</script>

<button {...buttonProps} on:click on:focus on:blur on:mouseover on:mouseenter on:mouseleave>
  <slot />
</button>

<style>
  button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: bold;
    text-transform: uppercase;
    outline: none;
    cursor: pointer;
    border: none;
  }
  button:hover:enabled {
    text-decoration: underline;
  }
  button:active:enabled {
    transform: translateY(1px);
  }
  .c-button-primary {
    /* Primary button styles */
    background-color: var(--color-purple);
    color: white;
  }

  .c-button-secondary {
    /* Secondary button styles */
    background-color: white;
    color: var(--color-blue);
  }

  .c-button-warning {
    /* Warning button styles */
    background-color: red;
    color: white;
  }

  .c-button-accept {
    /* Accept button styles */
    background-color: green;
    color: white;
  }
</style>
