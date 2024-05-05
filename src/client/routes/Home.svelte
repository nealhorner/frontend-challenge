<script>
  import Card from '../lib/components/Card.svelte';
</script>

<main class="gradient">
  <div id="first-section">
    <div>
      <h1>Welcome to the Quiz App!</h1>
      <p>Get ready to test your knowledge.</p>
      <button>Start Quiz</button>
    </div>
  </div>
  <div id="second-section">
    <Card>
      <p>
        Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
        how to build Svelte apps.
      </p>
    </Card>
  </div>
</main>

<style>
  #first-section {
    background-color: var(--color-purple);
    color: white;
    padding: 20px;
    height: 200px;
    width: 100%;
    clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%);
  }
  #first-section > div {
    max-width: 800px;
    margin: 0 auto;
  }
  #second-section {
    padding: 20px;
  }

  .gradient {
    background-color: var(--color-yellow);
    background-image: repeating-radial-gradient(
      circle at 0 0,
      var(--color-yellow),
      var(--color-pink) 10px,
      var(--color-orange) 10px,
      var(--color-pink) 20px /* determines size */
    );
  }

  /* https://css-irl.info/css-halftone-patterns/ */
  .halftone {
    position: relative;
    aspect-ratio: 1;
    background-color: var(--color-yellow);
    filter: contrast(20) invert(0);
    mix-blend-mode: multiply;
  }

  .halftone::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(
      circle at center,
      rgb(255 255 255) 3%,
      rgb(255 255 255 / 0.4) 70%
    );
    background-size: 0.75rem 0.75rem;
    background-repeat: round;
    background-position:
      0 0,
      calc(0.75rem / 2) calc(0.75rem / 2);
    -webkit-mask-image: linear-gradient(rgb(0 0 0), rgb(0 0 0 / 0.5));
    mask-image: linear-gradient(rgb(0 0 0), rgb(0 0 0 / 0.5));
    mask-size: cover;
    mask-position: center;
    transition: background-size 100ms;
  }
</style>
