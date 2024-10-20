<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import Button from './Button.svelte';
  import RadioGroup from './RadioGroup.svelte';
  let answer = '';
  type MultipleChoiceOption = string[]; // Array of strings type

  const dispatch = createEventDispatcher();

  export let questionId: string;

  let promise = getQuestion(questionId);

  async function getQuestion(questionId: string) {
    const response = await fetch(`/api/question/${questionId}`);
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data);
    }
  }

  function parseMultipleChoiceOptions(options: string): MultipleChoiceOption {
    return JSON.parse(options).map((option: string) => ({
      label: option,
      value: option
    }));
  }

  function handleSubmit() {
    //Check answer
    console.log(answer);

    dispatch('submit');
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
        <div style="margin-top: 15px">
          <Button
            on:click={handleSubmit}
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
    margin-top: 2rem;
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
</style>
