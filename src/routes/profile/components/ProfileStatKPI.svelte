<script lang="ts">
  interface Props {
    kpi: string;
    value: string; // value should be formatted as a string
  }
  let { kpi, value }: Props = $props();
</script>

<div class="kpi">
  <span class="value">{value}</span>
  <span class="label">{kpi}</span>
</div>

<style>
  .kpi {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding: var(--space-md) var(--space-lg);
    border: 1px solid var(--color-border-card);
    border-radius: var(--radius-card);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-sm);
  }

  .value {
    color: var(--color-text);
    font-size: var(--text-2xl);
    font-weight: 700;
    letter-spacing: var(--tracking-tight);
    line-height: 1.1;
    overflow-wrap: anywhere;
  }

  .label {
    color: var(--color-text-secondary);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }
</style>
