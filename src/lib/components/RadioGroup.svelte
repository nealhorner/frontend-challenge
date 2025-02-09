<script lang="ts">
  import type { ParsedMultipleChoiceOptions } from '$lib/types';
  import type { ChangeEventHandler } from 'svelte/elements';

  interface Props {
    label: string;
    options: ParsedMultipleChoiceOptions[];
    onchange: ChangeEventHandler<HTMLInputElement>;
  }
  let { label, options, onchange }: Props = $props();
</script>

<fieldset>
  <legend>{label}</legend>
  <div>
    {#each options as option}
      <div class="radio-option no-select">
        <label>
          <input type="radio" value={option.value} {onchange} />
          {option.label}
        </label>
      </div>
    {/each}
  </div>
</fieldset>

<style>
  fieldset {
    margin-top: 1rem;
    border: none;
  }

  .radio-option {
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
  }

  .radio-option:first-child {
    margin-top: 0;
  }

  .radio-option input[type='radio'] {
    accent-color: var(--color-purple);
  }

  legend {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
