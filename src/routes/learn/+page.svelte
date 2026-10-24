<script lang="ts">
  import type { PageData } from './$types';
  import Faq from '$lib/components/faq/FAQ.svelte';
  import PageContent from '$lib/components/PageContent.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
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

<PageContent>
  <PageHeader eyebrow="Keep learning" title="Learning Resources">
    <p>Curated blogs, courses, and podcasts hand-picked to level up your frontend skills.</p>
    <ul class="stats">
      <li>{blogs.length} blogs</li>
      <li>{courses.length} courses</li>
      <li>{podcasts.length} podcasts</li>
    </ul>
  </PageHeader>

  <div class="filter-bar" role="group" aria-label="Filter resources">
    {#each filters as f (f.value)}
      <button
        type="button"
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
</PageContent>

<style>
  .stats {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    margin: var(--space-md) 0 0;
    padding: 0;
    list-style: none;
  }

  .stats li {
    padding: 0.125rem 0.625rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    background-color: var(--color-surface);
    color: var(--color-text-secondary);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
  }

  /* Segmented control, matching the header's nav pill */
  .filter-bar {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 2px;
    margin-bottom: var(--space-xl);
    padding: 3px;
    border-radius: var(--radius-xl);
    background-color: var(--color-surface-sunken);
  }

  .filter-bar button {
    padding: 0.375rem 1rem;
    border: 0;
    border-radius: var(--radius-button);
    background: transparent;
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
    font-weight: 500;
    cursor: pointer;
    transition:
      color var(--transition-fast),
      background-color var(--transition-fast);
  }

  .filter-bar button:hover {
    color: var(--color-text);
  }

  .filter-bar button.active {
    background-color: var(--color-surface);
    color: var(--color-link);
    box-shadow: var(--shadow-sm);
  }

  section {
    margin-bottom: var(--space-xl);
  }

  h2 {
    margin: 0 0 var(--space-md);
    color: var(--color-link);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .resource-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
    gap: var(--space-md);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .faq-section {
    margin: var(--space-2xl) 0 0;
    padding-top: var(--space-xl);
    border-top: 1px solid var(--color-border);
  }

  @media (max-width: 600px) {
    .resource-grid {
      /* minmax(0, …) lets cards shrink below long unbreakable URLs. */
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
