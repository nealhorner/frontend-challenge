<script>
  import Button from './Button.svelte';
  let answer = '';

  let promise = getQuestion();

  async function getQuestion() {
    const response = await fetch('/api/question');
    const data = await response.json();
    console.log('$$$$$$$$$');
    console.log(data);

    if (response.ok) {
      return data;
    } else {
      throw new Error(data);
    }
  }

  async function handleSubmit() {
    //Check answer

    // Show answer

    // Get next question
    promise = getQuestion();
  }

  // shuffle array function
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  const haveAnswer = (answer) => {
    return answer !== '';
  };
</script>

<main>
  {#await promise}
    <p>...waiting</p>
  {:then question}
    <div class="question">
      <h1>{question.title}</h1>
      <p>{question.prompt}</p>
      {#if question.type === 'blind_answer'}
        <input
          type="text"
          placeholder="Enter your answer"
          bind:value={answer}
        />
      {:else if question.type === 'multiple_choice'}
        {#each JSON.parse(question.multipleChoiceOptions) as choice}
          <label>
            <input
              type="radio"
              name="choice"
              value={choice}
              bind:group={answer}
            />
            {choice}
          </label>
        {/each}
      {:else}
        <p>No Implemented: {question.type}</p>
      {/if}
      <div style="margin-top: 15px">
        <Button
          on:click={handleSubmit}
          type="secondary-button"
          text="Submit"
          disabled={!haveAnswer(answer)}
        />
      </div>
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

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }

  .question {
    text-align: left;
  }
</style>
