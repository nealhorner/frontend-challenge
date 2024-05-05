<script>
  import Card from '../lib/components/Card.svelte';
</script>

<main>
  <div id="first-section" class="linear-gradient">
    <div>
      <h1>Welcome to the Quiz App!</h1>
      <p>Get ready to test your knowledge.</p>
      <button>Start Quiz</button>
    </div>
  </div>
  <div id="second-section">
    <Card>
      <p style="width: 50%">
        Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
        how to build Svelte apps.
      </p>
    </Card>
  </div>
  <div id="third-section" class="pipe-gradient">
    <p>Hello World</p>
  </div>
</main>

<style>
  main {
    height: calc(100vh - 59px);
  }

  #first-section {
    background-color: var(--color-purple);
    color: white;
    padding: 20px 0px;
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

  .linear-gradient {
    background: -moz-linear-gradient(
      -45deg,
      rgba(243, 130, 111, 0.25) 0%,
      rgba(0, 0, 0, 0) 100%
    ); /* FF3.6+ */
    background: -webkit-gradient(
      linear,
      left top,
      right bottom,
      color-stop(0%, rgba(243, 130, 111, 0.25)),
      color-stop(100%, rgba(0, 0, 0, 0))
    ); /* Chrome,Safari4+ */
    background: -webkit-linear-gradient(
      -45deg,
      rgba(243, 130, 111, 0.25) 0%,
      rgba(0, 0, 0, 0) 100%
    ); /* Chrome10+,Safari5.1+ */
    background: -o-linear-gradient(
      -45deg,
      rgba(243, 130, 111, 0.25) 0%,
      rgba(0, 0, 0, 0) 100%
    ); /* Opera 11.10+ */
    background: -ms-linear-gradient(
      -45deg,
      rgba(243, 130, 111, 0.25) 0%,
      rgba(0, 0, 0, 0) 100%
    ); /* IE10+ */
    background: linear-gradient(
      135deg,
      rgba(243, 130, 111, 0.25) 0%,
      rgba(0, 0, 0, 0) 100%
    ); /* W3C */
  }
  .pipe-gradient {
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
