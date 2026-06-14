<script lang="ts">
  interface Props {
    kpi: string;
    value: string; // value should be formatted as a string
  }
  let { kpi, value }: Props = $props();
</script>

<div>
  <span class="value">{value}</span>
  <span class="label">{kpi}</span>
</div>

<style>
  div {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 1rem;
  }
  .value {
    font-size: 45px;
    font-weight: 600;
    letter-spacing: -1.2px;
    line-height: 45px;
  }
  .label {
    font-size: 16px;
    font-weight: 500;
  }
</style>
