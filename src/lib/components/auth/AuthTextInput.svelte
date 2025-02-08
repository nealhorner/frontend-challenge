<script lang="ts">
  interface Props {
    label?: string;
    type?: string;
    id?: string;
    name?: string;
    autocomplete?: string;
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

  let haveError = error !== '';
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
    border: 1px solid #ccc;
    border-radius: 4px;
    display: block;
    width: 100%;
    box-sizing: border-box;
  }

  .error-input {
    border-color: red;
    background-color: rgba(255, 0, 0, 0.05);
  }

  .error-message {
    margin-top: 2px;
    color: red;
  }
</style>
