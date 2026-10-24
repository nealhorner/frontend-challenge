<script lang="ts">
  import MdiPlus from 'virtual:icons/mdi/plus';
  import MdiMinus from 'virtual:icons/mdi/minus';

  type FAQItem = {
    question: string;
    answer: string;
  };

  interface Props {
    faqItems?: FAQItem[];
  }

  let { faqItems = [] }: Props = $props();

  const id = $props.id();
  let activeItem: number | null = $state(null);

  function toggleItem(index: number) {
    activeItem = activeItem === index ? null : index;
  }
</script>

<div class="faq">
  <h2>FAQ</h2>
  <div class="faq-container">
    {#each faqItems as item, index (item.question)}
      <div class="faq-item">
        <h3>
          <button
            type="button"
            class="faq-question"
            class:active={activeItem === index}
            aria-expanded={activeItem === index}
            aria-controls="{id}-answer-{index}"
            onclick={() => toggleItem(index)}
          >
            <span>{item.question}</span>
            {#if activeItem === index}
              <MdiMinus aria-hidden="true" />
            {:else}
              <MdiPlus aria-hidden="true" />
            {/if}
          </button>
        </h3>
        <div id="{id}-answer-{index}" class="faq-answer" hidden={activeItem !== index}>
          {item.answer}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  h2 {
    margin: 0 0 var(--space-md);
    font-size: var(--text-2xl);
  }

  .faq-container {
    overflow: hidden;
    border: 1px solid var(--color-border-card);
    border-radius: var(--radius-card);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-sm);
  }

  .faq-item + .faq-item {
    border-top: 1px solid var(--color-border);
  }

  h3 {
    margin: 0;
    font-size: inherit;
  }

  .faq-question {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
    width: 100%;
    padding: var(--space-md) var(--space-lg);
    border: 0;
    background: none;
    color: var(--color-text);
    font-size: var(--text-md);
    font-weight: 600;
    text-align: left;
    cursor: pointer;
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast);
  }

  .faq-question:hover {
    background-color: var(--color-hover);
  }

  .faq-question:focus-visible {
    outline-offset: -2px;
  }

  .faq-question.active {
    color: var(--color-link);
  }

  .faq-question :global(svg) {
    flex-shrink: 0;
    color: var(--color-text-muted);
  }

  .faq-question.active :global(svg) {
    color: var(--color-link);
  }

  .faq-answer {
    padding: 0 var(--space-lg) var(--space-md);
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
    line-height: 1.6;
  }
</style>
