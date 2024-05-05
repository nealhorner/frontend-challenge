<script>
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
</script>

<main>
  {#await promise}
    <p>...waiting</p>
  {:then question}
    <div class="question">
      <h1>{question.title}</h1>
      <p>{question.prompt}</p>
      <p>{question.type}</p>
      {#if question.type === 'blind'}
        <input type="text" placeholder="Enter your answer" />
      {/if}
      <button on:click={handleSubmit}>Submit</button>
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
