<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props {
    label?: string;
    type?: string;
    id?: string;
    name?: string;
    autocomplete?: HTMLInputAttributes['autocomplete'];
    error?: string;
  }

  let {
    label = '',
    type = 'text',
    id = '',
    name = '',
    autocomplete = '',
    error = ''
  }: Props = $props();

  let haveError = $derived(error !== '');
</script>

<div>
  <label for={name}>{label}</label>
  <input {type} {id} {name} {autocomplete} required class={haveError ? 'error-input' : ''} />
  {#if haveError}
    <div class="error-message">{error}</div>
  {/if}
</div>

<style>
  label {
    display: block;
    margin-bottom: var(--space-xs);
    color: var(--color-text);
    font-size: var(--text-sm);
    font-weight: 500;
  }

  input {
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 0.5625rem 0.75rem;
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-sm);
    background-color: var(--color-surface);
    color: var(--color-text);
    line-height: 1.25rem;
    transition:
      border-color var(--transition-fast),
      box-shadow var(--transition-fast);
  }

  input:hover {
    border-color: var(--color-text-muted);
  }

  input:focus-visible {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: var(--focus-ring);
  }

  .error-input {
    border-color: var(--color-error);
    background-color: var(--color-error-soft);
  }

  .error-message {
    margin-top: var(--space-xs);
    color: var(--color-error-text);
    font-size: var(--text-sm);
  }
</style>
