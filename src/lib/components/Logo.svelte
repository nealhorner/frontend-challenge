<script lang="ts">
  interface Props {
    size?: 'md' | 'sm';
  }

  let { size = 'md' }: Props = $props();
</script>

<a href="/" class="logo {size}" aria-label="Frontend Challenge home">
  <span class="mark" aria-hidden="true">&lt;/&gt;</span>
  <span class="wordmark">Frontend<span class="accent">Challenge</span></span>
</a>

<style>
  .logo {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    color: var(--color-text);
    text-decoration: none;
    white-space: nowrap;
  }

  .logo:hover {
    text-decoration: none;
  }

  .mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: 1px solid var(--color-primary-border);
    border-radius: var(--radius-button);
    background-color: var(--color-primary-soft);
    color: var(--color-link);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 700;
    letter-spacing: -0.05em;
  }

  .wordmark {
    font-size: var(--text-lg);
    font-weight: 700;
    letter-spacing: var(--tracking-tight);
  }

  .accent {
    color: var(--color-link);
  }

  .sm .mark {
    width: 1.625rem;
    height: 1.625rem;
    font-size: 0.6875rem;
  }

  .sm .wordmark {
    font-size: var(--text-md);
  }
</style>
