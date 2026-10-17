<script lang="ts">
  import ButtonLink from './ButtonLink.svelte';
  import IconChevronRight from '~icons/mdi/chevron-right';
  import IconCompass from '~icons/mdi/compass-outline';
  import IconPlay from '~icons/mdi/play';
  import IconSchool from '~icons/mdi/school-outline';
  import IconTrendingUp from '~icons/mdi/trending-up';
</script>

<section class="hero">
  <h1>How sharp are your <span class="accent">frontend skills?</span></h1>
  <p class="hero-subhead">
    Answer real-world JavaScript, CSS, React &amp; HTTP questions. Track your accuracy and climb the
    global rankings.
  </p>
  <div class="button-tray">
    <ButtonLink href="/quiz" kind="primary" size="lg"><IconPlay />Start a Quiz</ButtonLink>
    <ButtonLink href="/login" kind="secondary" size="lg">
      Sign In<IconChevronRight class="chevron" />
    </ButtonLink>
  </div>
  <ul class="trust">
    <!-- Keep these true to what the app does today. Questions are picked at
         random (one per question family) and ELO tracks skill; switch the
         rating line to adaptive wording once adaptive selection ships. -->
    <li><IconSchool class="success" />Free to learn</li>
    <li><IconTrendingUp class="info" />A rating that grows with you</li>
    <li><IconCompass class="keyword" />Broaden your frontend knowledge</li>
  </ul>
</section>

<style>
  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: var(--page-content-max-width);
    margin: 0 auto;
    padding: var(--space-xl) var(--page-content-padding) var(--space-lg);
    text-align: center;
  }

  h1 {
    max-width: 56rem;
    margin: var(--space-lg) 0 0;
    font-size: var(--text-4xl);
    line-height: 1.15;
    text-wrap: balance;
  }

  .accent {
    background: var(--gradient-accent-text);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .hero-subhead {
    max-width: 42rem;
    margin: var(--space-md) 0 0;
    color: var(--color-text-secondary);
    font-size: var(--text-lg);
    line-height: 1.6;
  }

  .button-tray {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-md);
    margin-top: var(--space-lg);
  }

  .button-tray :global(.chevron) {
    margin-right: -0.25rem;
    color: var(--color-text-muted);
  }

  .trust {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-sm) var(--space-lg);
    margin: var(--space-lg) 0 0;
    padding: 0;
    list-style: none;
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
  }

  .trust li {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
  }

  .trust li + li::before {
    content: '';
    width: 4px;
    height: 4px;
    margin-right: calc(var(--space-lg) - 0.375rem);
    border-radius: var(--radius-full);
    background-color: var(--color-border-strong);
  }

  .trust :global(svg) {
    font-size: 1rem;
  }

  .trust :global(.success) {
    color: var(--color-success);
  }

  .trust :global(.info) {
    color: var(--color-info);
  }

  .trust :global(.keyword) {
    color: var(--color-syntax-keyword);
  }

  @media (max-width: 600px) {
    /* Let the CTAs stretch full width and stack on small screens */
    .button-tray {
      width: 100%;
      flex-direction: column;
      align-items: stretch;
    }

    .trust li + li::before {
      display: none;
    }
  }
</style>
