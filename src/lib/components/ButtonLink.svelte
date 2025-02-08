<script lang="ts">
  type Kind = 'primary' | 'secondary' | 'warning' | 'accept';
  type Type = 'button' | 'submit' | 'reset';

  interface Props {
    href?: string;
    kind?: Kind;
    disabled?: boolean;
    type?: Type;
    children?: import('svelte').Snippet;
  }

  let {
    href = '',
    kind = 'primary',
    disabled = false,
    type = 'button',
    children
  }: Props = $props();

  let buttonProps = $derived({
    type,
    disabled,
    class: ['no-select', kind && `c-button-${kind}`].filter(Boolean).join(' ')
  });
</script>

<a {href} {...buttonProps}>
  {@render children?.()}
</a>

<style>
  a {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: bold;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;
    border: none;
  }
  a:hover {
    text-decoration: underline;
  }
  a:focus:enabled {
    text-decoration: underline;
  }
  a:active:enabled {
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
