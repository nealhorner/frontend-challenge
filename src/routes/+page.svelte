<script>
  import ButtonLink from '$lib/components/ButtonLink.svelte';
  import TryQuestion from '$lib/components/TryQuestion.svelte';
  import WelcomeSection from '$lib/components/WelcomeSection.svelte';

  const valueProps = [
    {
      title: 'Track your accuracy',
      body: 'Every answer feeds your running score so you can watch your progress over time.'
    },
    {
      title: 'Climb the rankings',
      body: 'An ELO-style rating pits your skills against the rest of the community.'
    },
    {
      title: 'Learn as you go',
      body: 'See the right answer instantly and dig into curated resources to level up.'
    }
  ];

  const topics = ['JavaScript', 'CSS', 'React', 'HTTP', 'DOM', 'Closures', '+ more'];
</script>

<svelte:head>
  <title>Frontend Challenge — Test your frontend skills</title>
  <meta
    name="description"
    content="Answer real-world JavaScript, CSS, React and HTTP questions. Track your accuracy and climb the global rankings."
  />
</svelte:head>

<WelcomeSection />

<TryQuestion />

<section class="value">
  <div class="value-inner">
    <div class="value-grid">
      {#each valueProps as prop (prop.title)}
        <div class="value-card">
          <h2>{prop.title}</h2>
          <p>{prop.body}</p>
        </div>
      {/each}
    </div>

    <div class="topics">
      <p class="topics-label">Covering the topics that matter</p>
      <ul class="topic-tags">
        {#each topics as topic (topic)}
          <li>{topic}</li>
        {/each}
      </ul>
    </div>
  </div>
</section>

<section class="final-cta">
  <h2>Ready to find out where you stand?</h2>
  <ButtonLink href="/quiz" kind="primary">Start Your First Quiz</ButtonLink>
</section>

<style>
  .value {
    background-color: var(--color-yellow);
    padding: 56px var(--page-content-padding);
  }
  .value-inner {
    max-width: var(--page-content-max-width);
    margin: 0 auto;
  }
  .value-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
  }
  .value-card {
    background-color: white;
    border-radius: var(--card-border-radius);
    padding: 24px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }
  .value-card h2 {
    font-size: 1.15rem;
    font-weight: 500;
    color: var(--color-purple);
    margin: 0 0 8px;
  }
  .value-card p {
    margin: 0;
    color: var(--color-text);
    line-height: 1.5;
  }

  .topics {
    text-align: center;
    margin-top: 40px;
  }
  .topics-label {
    font-size: 0.85rem;
    color: var(--color-purple);
    margin: 0 0 14px;
  }
  .topic-tags {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  }
  .topic-tags li {
    background-color: white;
    color: var(--color-blue);
    font-size: 0.85rem;
    padding: 6px 14px;
    border-radius: 999px;
  }

  .final-cta {
    background-color: var(--color-purple);
    text-align: center;
    padding: 56px var(--page-content-padding);
  }
  .final-cta h2 {
    color: var(--color-yellow);
    font-size: clamp(1.4rem, 4vw, 1.8rem);
    font-weight: 500;
    margin: 0 0 24px;
  }

  @media (max-width: 600px) {
    .value,
    .final-cta {
      padding: 44px 20px;
    }
  }
</style>
