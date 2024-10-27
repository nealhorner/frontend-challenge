<script lang="ts">
  import Button from './Button.svelte';
  import RadioGroup from './RadioGroup.svelte';
  import DebugInfo from './DebugInfo.svelte';
  import type { ParsedMultipleChoiceOptions } from '$lib/types';

  let answer = '';
  let promise: Promise<any>;

  export let questionId: string;
  export let submitHandler: (answer: string) => void;

  $: if (questionId) {
    promise = getQuestion(questionId);
    answer = '';
  }

  async function getQuestion(questionId: string) {
    const response = await fetch(`/api/question/${questionId}`);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data);
    }
  }

  function parseMultipleChoiceOptions(options: string): ParsedMultipleChoiceOptions[] {
    return JSON.parse(options).map((option: string) => ({
      label: option,
      value: option
    }));
  }

  function shuffle(array: any[]) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  const haveAnswer = (answer: string) => {
    return answer !== '';
  };
</script>

<main>
  {#await promise}
    <p>...waiting</p>
  {:then question}
    <div class="question no-select">
      <form>
        <p id="question-title">{question.title}</p>
        <h2>{question.prompt}</h2>
        {#if question.type === 'blind_answer'}
          <input type="text" placeholder="Enter your answer" bind:value={answer} />
        {:else if question.type === 'multiple_choice'}
          <RadioGroup
            label="label"
            options={parseMultipleChoiceOptions(question.multipleChoiceOptions)}
            bind:value={answer}
          />
        {:else}
          <p>No Implemented: {question.type}</p>
        {/if}
        <div class="submit-container">
          <Button
            on:click={() => submitHandler(answer)}
            kind="secondary"
            disabled={question.type !== 'multiple_choice' && !haveAnswer(answer)}>Submit</Button
          >
        </div>
      </form>
    </div>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</main>

<style>
  main {
    text-align: center;
  }

  #question-title {
    color: #888;
    margin: 5px 0px;
  }

  h2 {
    font-size: 1.5rem;
    margin-top: 0px;
    margin-bottom: 1rem;
  }

  .question {
    text-align: left;
  }

  .submit-container {
    margin: 15px 0px;
  }
</style>
