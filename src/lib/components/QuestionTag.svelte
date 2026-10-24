<script lang="ts">
  interface Props {
    tag: string;
  }

  let { tag }: Props = $props();

  // Each hue has text, background and border tokens per theme in tokens.css.
  const hues = ['sky', 'emerald', 'violet', 'amber', 'rose', 'slate'];

  // Hash the tag name so the same topic always gets the same hue.
  function getHue(tag: string) {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hues[Math.abs(hash) % hues.length];
  }

  let hue = $derived(getHue(tag));
</script>

<span
  class="question-tag"
  style:--tag-text="var(--topic-{hue}-text)"
  style:--tag-bg="var(--topic-{hue}-bg)"
  style:--tag-border="var(--topic-{hue}-border)">{tag}</span
>

<style>
  .question-tag {
    display: inline-block;
    align-self: flex-start;
    margin: 0.5rem;
    padding: 0.125rem 0.625rem;
    border: 1px solid var(--tag-border);
    border-radius: var(--radius-full);
    background-color: var(--tag-bg);
    color: var(--tag-text);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 600;
    line-height: 1.25rem;
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }
</style>
