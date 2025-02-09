<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type Kind = 'primary' | 'secondary' | 'warning' | 'accept';

  interface ComponentProps extends HTMLButtonAttributes {
    children?: Snippet;
    kind?: Kind;
  }

  let {
    children,
    kind = 'primary',
    type = 'button',
    disabled = false,
    ...restProps
  }: ComponentProps = $props();

  let classList = $derived(['no-select', kind && `c-button-${kind}`].filter(Boolean).join(' '));
  let buttonProps: HTMLButtonAttributes = $derived({
    class: classList,
    type,
    disabled,
    ...restProps
  });
</script>

<button {...buttonProps}>
  {@render children?.()}
</button>

<style>
  button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    border: none;
  }
  button:hover:enabled {
    text-decoration: underline;
  }
  button:focus:enabled {
    text-decoration: underline;
  }
  button:active:enabled {
    transform: translateY(1px);
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
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
    outline: 1px solid var(--color-text-secondary);
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
