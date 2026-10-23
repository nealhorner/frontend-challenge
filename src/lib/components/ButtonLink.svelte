<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes } from 'svelte/elements';

  // Styles live in src/lib/styles/buttons.css, shared with Button.
  type Kind = 'primary' | 'secondary' | 'ghost' | 'warning';
  type Size = 'md' | 'lg';

  interface ComponentProps extends HTMLAnchorAttributes {
    children?: Snippet;
    kind?: Kind;
    size?: Size;
  }

  let {
    children,
    kind = 'primary',
    size = 'md',
    class: className = '',
    ...restProps
  }: ComponentProps = $props();

  let classList = $derived(
    ['c-button', `c-button-${kind}`, size === 'lg' && 'c-button-lg', 'no-select', className]
      .filter(Boolean)
      .join(' ')
  );
  let buttonLinkProps: HTMLAnchorAttributes = $derived({ class: classList, ...restProps });
</script>

<a {...buttonLinkProps}>
  {@render children?.()}
</a>
