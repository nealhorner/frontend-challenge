<script lang="ts">
  import type { PageData } from './$types';
  import Faq from '$lib/components/faq/FAQ.svelte';
  import ResourceListing from './components/ResourceListing.svelte';

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  type Filter = 'all' | 'blog' | 'course' | 'podcast';
  let activeFilter = $state<Filter>('all');

  let blogs = $derived(data.learning_resources.filter((r) => r.type === 'blog'));
  let courses = $derived(data.learning_resources.filter((r) => r.type === 'course'));
  let podcasts = $derived(data.learning_resources.filter((r) => r.type === 'podcast'));

  let filtered = $derived(
    activeFilter === 'all'
      ? data.learning_resources
      : data.learning_resources.filter((r) => r.type === activeFilter)
  );

  const filters: { label: string; value: Filter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Blogs', value: 'blog' },
    { label: 'Courses', value: 'course' },
    { label: 'Podcasts', value: 'podcast' }
  ];

  const faqItems = [
    {
      question: 'How can I submit a learning resource?',
      answer:
        'If you have any learning resources that you would like to share, feel free to submit them.'
    },
    {
      question: 'Where does the content come from?',
      answer: 'The data is extracted from OpenGraph data.'
    },
    {
      question: 'How can I contribute to this project?',
      answer: 'You can contribute by submitting a PR to the GitHub repository.'
    }
  ];
</script>

<svelte:head>
  <title>Learning Resources — Frontend Challenge</title>
  <meta
    name="description"
    content="Curated blogs, courses, and podcasts to level up your frontend skills."
  />
</svelte:head>

<div class="hero">
  <div class="hero-inner">
    <h1>Learning Resources</h1>
    <p class="hero-sub">
      Curated blogs, courses, and podcasts hand-picked to level up your frontend skills.
    </p>
    <div class="stats">
      <span class="stat">{blogs.length} blogs</span>
      <span class="divider">·</span>
      <span class="stat">{courses.length} courses</span>
      <span class="divider">·</span>
      <span class="stat">{podcasts.length} podcasts</span>
    </div>
  </div>
</div>

<div class="content">
  <div class="content-inner">
    <div class="filter-bar" aria-label="Filter resources">
      {#each filters as f (f.value)}
        <button
          aria-pressed={activeFilter === f.value}
          class:active={activeFilter === f.value}
          onclick={() => (activeFilter = f.value)}
        >
          {f.label}
        </button>
      {/each}
    </div>

    {#if activeFilter === 'all'}
      {#each [{ label: 'Blogs', type: 'blog', items: blogs }, { label: 'Courses', type: 'course', items: courses }, { label: 'Podcasts', type: 'podcast', items: podcasts }] as section (section.type)}
        <section>
          <h2>{section.label}</h2>
          <ul class="resource-grid">
            {#each section.items as resource (resource.url)}
              <li>
                <ResourceListing
                  title={resource.title}
                  url={resource.url}
                  description={resource.description}
                  imageURL={resource.imageUrl}
                />
              </li>
            {/each}
          </ul>
        </section>
      {/each}
    {:else}
      <ul class="resource-grid">
        {#each filtered as resource (resource.url)}
          <li>
            <ResourceListing
              title={resource.title}
              url={resource.url}
              description={resource.description}
              imageURL={resource.imageUrl}
            />
          </li>
        {/each}
      </ul>
    {/if}

    <section class="faq-section">
      <Faq {faqItems} />
    </section>
  </div>
</div>

<style>
  .hero {
    background-color: var(--color-blue);
    padding: 56px var(--page-content-padding);
    display: flex;
    justify-content: center;
  }
  .hero-inner {
    max-width: var(--page-content-max-width);
    width: 100%;
    text-align: center;
  }
  .hero h1 {
    color: var(--color-yellow);
    font-size: clamp(1.8rem, 5vw, 2.8rem);
    font-weight: 500;
    margin: 0 0 0.75rem;
    text-shadow: 2px 2px var(--color-orange);
    line-height: 1.15;
  }
  .hero-sub {
    color: rgba(255, 255, 255, 0.88);
    font-size: clamp(1rem, 2vw, 1.1rem);
    line-height: 1.6;
    margin: 0 auto 1.5rem;
    max-width: 34rem;
  }
  .stats {
    display: flex;
    justify-content: center;
    gap: 10px;
    color: var(--color-yellow);
    font-size: 0.875rem;
    opacity: 0.8;
  }
  .divider {
    opacity: 0.5;
  }

  .content {
    padding: 40px var(--page-content-padding) 64px;
    display: flex;
    justify-content: center;
  }
  .content-inner {
    width: 100%;
    max-width: var(--page-content-max-width);
  }

  .filter-bar {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 36px;
  }
  .filter-bar button {
    padding: 7px 18px;
    border-radius: 999px;
    border: 1.5px solid var(--color-border);
    background: white;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
    cursor: pointer;
    transition:
      background 0.15s,
      border-color 0.15s,
      color 0.15s;
  }
  .filter-bar button:hover {
    border-color: var(--color-blue);
    color: var(--color-blue);
  }
  .filter-bar button.active {
    background-color: var(--color-blue);
    border-color: var(--color-blue);
    color: white;
  }

  section {
    margin-bottom: 48px;
  }
  h2 {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    margin: 0 0 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--color-border);
  }

  .resource-grid {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 14px;
  }

  .faq-section {
    margin-top: 16px;
    border-top: 1px solid var(--color-border);
    padding-top: 40px;
  }

  @media (max-width: 600px) {
    .hero {
      padding: 44px 20px;
    }
    .content {
      padding: 28px 16px 48px;
    }
    .resource-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
