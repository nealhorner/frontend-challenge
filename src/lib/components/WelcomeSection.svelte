<script lang="ts">
  import ButtonLink from './ButtonLink.svelte';
</script>

<div class="hero">
  <div class="hero-content">
    <!-- Keep this count in sync with the seed data in data/questions.json. It is
         hardcoded on purpose: the homepage is prerendered (see +page.ts), and the
         question data carries answers we must not ship to the client. -->
    <span class="hero-chip"> 34 expert-crafted challenges · no sign-up to start </span>
    <h1>How sharp are your frontend skills?</h1>
    <p class="hero-subhead">
      Answer real-world JavaScript, CSS, React &amp; HTTP questions. Track your accuracy and climb
      the global rankings.
    </p>
    <div class="button-tray">
      <ButtonLink href="/quiz" kind="primary">Start a Quiz</ButtonLink>
      <ButtonLink href="/login" kind="secondary">Sign In</ButtonLink>
    </div>
  </div>
</div>

<style>
  .hero {
    box-sizing: border-box;
    background-color: var(--color-blue);
    display: flex;
    justify-content: center;
    padding: 64px var(--page-content-padding);
  }
  .hero-content {
    width: 100%;
    max-width: var(--page-content-max-width);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .hero-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background-color: rgba(255, 237, 79, 0.15);
    color: var(--color-yellow);
    font-size: 0.85rem;
    padding: 6px 14px;
    border-radius: 999px;
    margin-bottom: 1.5rem;
  }
  h1 {
    color: var(--color-yellow);
    text-shadow: 2px 2px var(--color-orange);
    font-size: clamp(2rem, 6vw, 3.25rem);
    font-weight: 500;
    line-height: 1.1;
    margin: 0 0 1rem;
  }
  .hero-subhead {
    color: rgba(255, 255, 255, 0.9);
    font-size: clamp(1rem, 2.5vw, 1.2rem);
    line-height: 1.6;
    max-width: 30rem;
    margin: 0 auto 2rem;
  }
  .button-tray {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
  }

  @media (max-width: 600px) {
    .hero {
      padding: 48px 20px;
    }
    /* Let the CTAs stretch full width and stack on small screens */
    .button-tray {
      width: 100%;
      flex-direction: column;
      align-items: stretch;
    }
    .button-tray :global(a) {
      text-align: center;
    }
  }
</style>
