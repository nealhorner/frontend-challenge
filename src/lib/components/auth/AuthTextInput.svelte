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
    font-weight: bold;
  }

  input {
    padding: 0.5rem;
    border: 1px solid var(--ocean-color-mist-light);
    border-radius: 4px;
    display: block;
    width: 100%;
    box-sizing: border-box;
  }

  .error-input {
    border-color: var(--ocean-color-red-sun);
    background-color: var(--ocean-color-pale-pink);
  }

  .error-message {
    margin-top: 2px;
    color: var(--ocean-color-red-sun);
  }
</style>
