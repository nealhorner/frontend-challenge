<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    eyebrow?: string;
    align?: 'left' | 'center';
    // Lead paragraph under the title
    children?: Snippet;
    // Buttons or links beside the title (below it on small screens)
    actions?: Snippet;
  }

  let { title, eyebrow, align = 'left', children, actions }: Props = $props();
</script>

<header class="page-header {align}">
  <div class="text">
    {#if eyebrow}<span class="eyebrow">{eyebrow}</span>{/if}
    <h1>{title}</h1>
    {#if children}<div class="lead">{@render children()}</div>{/if}
  </div>
  {#if actions}<div class="actions">{@render actions()}</div>{/if}
</header>

<style>
  .page-header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--space-md) var(--space-lg);
    margin-bottom: var(--space-xl);
  }

  .center {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .text {
    max-width: 42rem;
  }

  .eyebrow {
    color: var(--color-link);
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  h1 {
    margin: var(--space-xs) 0 0;
    font-size: var(--text-3xl);
    line-height: 1.2;
    text-wrap: balance;
    overflow-wrap: anywhere;
  }

  .lead {
    margin-top: var(--space-sm);
    color: var(--color-text-secondary);
    font-size: var(--text-lg);
    line-height: 1.6;
  }

  .lead :global(p) {
    margin: 0;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }
</style>
