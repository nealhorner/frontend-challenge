<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes } from 'svelte/elements';

  type Kind = 'primary' | 'secondary' | 'warning' | 'accept';

  interface ComponentProps extends HTMLAnchorAttributes {
    children?: Snippet;
    kind?: Kind;
  }

  let { children, kind = 'primary', ...restProps }: ComponentProps = $props();

  let classList = $derived(['no-select', kind && `c-button-${kind}`].filter(Boolean).join(' '));
  let buttonLinkProps: HTMLAnchorAttributes = $derived({ class: classList, ...restProps });
</script>

<a {...buttonLinkProps}>
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
