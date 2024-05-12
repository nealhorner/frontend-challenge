<script>
  import Button from './Button.svelte';
  import RadioGroup from './RadioGroup.svelte';
  let answer = '';

  let promise = getQuestion();

  async function getQuestion() {
    const response = await fetch('/api/question');
    const data = await response.json();
    console.log(data);

    if (response.ok) {
      return data;
    } else {
      throw new Error(data);
    }
  }

  function handleSubmit() {
    //Check answer
    console.log(answer);

    // Show answer

    // Get next question
    promise = getQuestion();
  }

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
    <div class="question noselect">
      <form>
        <p id="question-title">{question.title}</p>
        <h2>{question.prompt}</h2>
        {#if question.type === 'blind_answer'}
          <input
            type="text"
            placeholder="Enter your answer"
            bind:value={answer}
          />
        {:else if question.type === 'multiple_choice'}
          <RadioGroup
            label="label"
            options={JSON.parse(question.multipleChoiceOptions).map(
              (option) => ({
                label: option,
                value: option,
              }),
            )}
            bind:value={answer}
          />
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
