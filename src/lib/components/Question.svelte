<script lang="ts">
  import { onMount } from 'svelte';
  import Button from './Button.svelte';
  import RadioGroup from './RadioGroup.svelte';
  import type { ParsedMultipleChoiceOptions, Question } from '$lib/types';

  let answer = '';
  let questionPromise: Promise<Question>;

  export let questionId: string;
  export let submitHandler: (answer: string) => void;

  onMount(async () => {
    if (!questionId) {
      questionId = await getRandomQuestionId();
    }
  });

  $: if (questionId) {
    questionPromise = getQuestion(questionId);
    answer = '';
  }

  async function getRandomQuestionId() {
    const response = await fetch('/api/question');
    const data = await response.json();
    if (response.ok) {
      return data.id;
    } else {
      throw new Error(data);
    }
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

  const haveAnswer = (answer: string) => {
    return answer !== '';
  };
</script>

<main>
  {#await questionPromise}
    <p>...waiting</p>
  {:then question}
    {#if question}
      <div class="question no-select">
        <form>
          {#if question.title}
            <p id="question-title">{question.title}</p>
          {/if}
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
    {/if}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</main>

<style>
  main {
    text-align: center;
    min-height: 250px;
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
