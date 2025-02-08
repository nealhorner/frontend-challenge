<script lang="ts">
  interface Props {
    tag: string;
  }

  let { tag }: Props = $props();
  const colors = [
    '#636EFA',
    '#EF553B',
    '#00CC96',
    '#AB63FA',
    '#FFA15A',
    '#19D3F3',
    '#FF6692',
    '#B6E880',
    '#FF97FF',
    '#FECB52'
  ];

  function getColor(tag: string) {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  let backgroundColor = $derived(getColor(tag));
</script>

<div style="background-color: {backgroundColor}">{tag}</div>

<style>
  div {
    display: inline-block;
    padding: 0.5rem 1rem;
    margin: 0.5rem;
    border-radius: 0.5rem;
    color: var(--color-white);
    align-self: flex-start;
  }
</style>
