<script lang="ts">
  interface Props {
    tag: string;
  }

  let { tag }: Props = $props();
  const colors = [
    '#008f98', // teal
    '#1c4067', // navy
    '#5e8fbe', // sky-blue
    '#495363', // slate
    '#e78571', // salmon
    '#f2973d', // tangerine
    '#de4d1c', // tomato
    '#c4393e', // red-sun
    '#5f7081', // mist
    '#3a3a3a'  // charcoal
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
