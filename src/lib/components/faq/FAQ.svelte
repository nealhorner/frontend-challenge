<script lang="ts">
  import MdiPlus from 'virtual:icons/mdi/plus';
  import MdiMinus from 'virtual:icons/mdi/minus';

  type FAQItem = {
    question: string;
    answer: string;
  };

  export let faqItems: FAQItem[] = [];

  let activeItem: number | null = null;

  function toggleItem(index: number) {
    activeItem = activeItem === index ? null : index;
  }
</script>

<div>
  <h3>FAQ</h3>
  <div class="faq-container">
    {#each faqItems as item, index}
      <div class="faq-item">
        <summary
          class="faq-question no-select {activeItem === index ? 'active' : ''}"
          on:click={() => toggleItem(index)}
        >
          {item.question}
          {#if activeItem === index}
            <MdiMinus />
          {:else}
            <MdiPlus />
          {/if}
        </summary>
        {#if activeItem === index}
          <div class="faq-answer active">{item.answer}</div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  h3 {
    text-align: center;
    font-size: larger;
  }

  .faq-container {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: var(--card-border-radius);
    box-shadow:
      0px 1px 2px -1px rgba(0, 0, 0, 0.1),
      0px 1px 3px 0px rgba(0, 0, 0, 0.1);
  }
  .faq-item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  .faq-question:hover {
    background-color: #f9f9f9;
    cursor: pointer;
  }

  .faq-question.active {
    color: var(--color-orange);
  }

  .faq-item:first-child {
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
  }

  .faq-item:last-child {
    border-bottom: none;
    border-bottom-left-radius: 7px;
    border-bottom-right-radius: 7px;
  }

  .faq-question {
    padding: 10px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
  }

  .faq-answer {
    display: none;
    color: var(--color-text-secondary);
    font-size: smaller;
    padding: 5px 10px 10px 10px;
  }

  .faq-answer.active {
    display: block;
  }
</style>
