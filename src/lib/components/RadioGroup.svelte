<script lang="ts">
  import type { ParsedMultipleChoiceOptions } from '$lib/types';
  import type { ChangeEventHandler } from 'svelte/elements';

  interface Props {
    label: string;
    options: ParsedMultipleChoiceOptions[];
    onchange: ChangeEventHandler<HTMLInputElement>;
  }
  let { label, options, onchange }: Props = $props();

  // A shared name groups the radios, so only one answer can be checked.
  const name = $props.id();
  let group: HTMLElement | undefined = $state();

  // Number keys 1–9 pick an option, matching the [n] hints.
  function onKeydown(event: KeyboardEvent) {
    if (!group || event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as HTMLElement;
    if (target.closest('input:not([type="radio"]), textarea, select, [contenteditable]')) return;
    // Don't answer while focus is on another link or button on the page
    const control = target.closest('a, button, summary, [role="button"]');
    if (control && !group.contains(control)) return;
    const input =
      group.querySelectorAll<HTMLInputElement>('input[type="radio"]')[Number(event.key) - 1];
    if (input && !input.checked) {
      input.click();
      input.focus();
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<fieldset>
  <legend class="visually-hidden">{label}</legend>
  <div class="options" bind:this={group}>
    {#each options as option, i (i)}
      <label class="option no-select">
        <input type="radio" {name} value={option.value} {onchange} />
        {#if i < 9}<span class="key" aria-hidden="true">[{i + 1}]</span>{/if}
        <span class="text">{option.label}</span>
      </label>
    {/each}
  </div>
</fieldset>

<style>
  fieldset {
    margin: 0;
    padding: 0;
    border: 0;
    min-width: 0;
  }

  .options {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-sm);
  }

  .option {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-button);
    background-color: var(--color-surface-sunken);
    color: var(--color-text);
    cursor: pointer;
    transition:
      border-color var(--transition-fast),
      background-color var(--transition-fast),
      box-shadow var(--transition-fast);
  }

  .option:hover {
    border-color: var(--color-primary-border);
    background-color: var(--color-surface-raised);
  }

  .option:has(input:checked) {
    border-color: var(--color-primary);
    background-color: var(--color-primary-soft);
    box-shadow: var(--shadow-primary-rest);
  }

  .option:has(input:focus-visible) {
    box-shadow: var(--focus-ring);
  }

  input {
    flex-shrink: 0;
    width: 1rem;
    height: 1rem;
    margin: 0;
    accent-color: var(--color-primary);
  }

  input:focus-visible {
    outline: none;
  }

  .key {
    flex-shrink: 0;
    padding: 0.125rem 0.375rem;
    border-radius: var(--radius-sm);
    background-color: var(--color-surface);
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 600;
  }

  .option:has(input:checked) .key {
    color: var(--color-link);
  }

  .text {
    min-width: 0;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  @media (max-width: 600px) {
    .options {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
