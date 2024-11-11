<script>
  import Card from '../lib/components/Card.svelte';
  import Question from '../lib/components/Question.svelte';
  import ButtonLink from '$lib/components/ButtonLink.svelte';
  import WelcomeSection from '$lib/components/WelcomeSection.svelte';
</script>

<svelte:head>
  <title>Frontend Challenge Home</title>
  <meta name="description" content="Frontend Challenge Home" />
</svelte:head>

<section>
  <WelcomeSection />
  <div id="second-section">
    <div>
      <Card>
        <p>
          Our questions are crafted by industry experts to simulate actual development scenarios,
          helping you to not only test your knowledge but also improve your problem-solving
          capabilities in a fun and engaging way.
        </p>
        <p>
          Each challenge is designed to push your boundaries and expand your understanding of how
          web technologies work together.
        </p>
        <p>
          Select a challenge, and see if you can rise to the occasion of becoming a frontend
          maestro!
        </p>
      </Card>
    </div>
    <div>
      <Question questionId="" submitHandler={() => {}} />
    </div>
  </div>
  <div id="third-section" class="pipe-gradient">
    <p>Hello World</p>
  </div>
</section>

<style>
  section {
    height: calc(100vh - 59px);
  }
  #second-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  #second-section > div {
    padding: 80px 40px;
    margin-top: -100px;
    padding-top: 140px;
  }
  #second-section div:first-child {
    background-color: var(--color-yellow);
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

  @media (max-width: 600px) {
    #second-section {
      grid-template-columns: 1fr;
    }
  }
</style>
