<script lang="ts">
  import { onMount } from 'svelte';
  import { getTheme, setTheme, type Theme } from '$lib/theme';

  let theme: Theme = $state('light');

  onMount(() => {
    theme = getTheme();
    // Follow every change to the applied theme, including the OS switching
    // it while no choice is saved (handled by the script in src/app.html).
    const observer = new MutationObserver(() => (theme = getTheme()));
    observer.observe(document.documentElement, { attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  });

  function toggle() {
    // Read the live theme: the OS may have switched it since mount.
    theme = getTheme() === 'dark' ? 'light' : 'dark';
    setTheme(theme);
  }
</script>

<button
  type="button"
  class="theme-toggle"
  onclick={toggle}
  aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
  title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
>
  {#if theme === 'dark'}
    <!-- Sun -->
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      />
    </svg>
  {:else}
    <!-- Moon -->
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  {/if}
</button>

<style>
  .theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    background: var(--color-surface);
    color: var(--color-text-secondary);
    cursor: pointer;
    transition:
      color var(--transition-fast),
      border-color var(--transition-fast),
      background-color var(--transition-fast);
  }

  .theme-toggle:hover {
    color: var(--color-text);
    border-color: var(--color-border-strong);
    background: var(--color-surface-sunken);
  }

  svg {
    width: 1.125rem;
    height: 1.125rem;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
