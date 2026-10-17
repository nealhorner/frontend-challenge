<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  // Styles live in src/lib/styles/buttons.css, shared with ButtonLink.
  type Kind = 'primary' | 'secondary' | 'ghost' | 'warning';
  type Size = 'md' | 'lg';

  interface ComponentProps extends HTMLButtonAttributes {
    children?: Snippet;
    kind?: Kind;
    size?: Size;
  }

  /* eslint-disable svelte/valid-compile */
  let {
    children,
    kind = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    class: className = '',
    ...restProps
  }: ComponentProps = $props();
  /* eslint-enable svelte/valid-compile */

  let classList = $derived(
    ['c-button', `c-button-${kind}`, size === 'lg' && 'c-button-lg', 'no-select', className]
      .filter(Boolean)
      .join(' ')
  );
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
