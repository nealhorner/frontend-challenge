<script lang="ts">
  import ButtonLink from '$lib/components/ButtonLink.svelte';
  import PageContent from '$lib/components/PageContent.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';
  import IconCoffee from '~icons/mdi/coffee-outline';
  import IconGithub from '~icons/mdi/github';
  import IconShare from '~icons/mdi/share-variant-outline';
</script>

<svelte:head>
  <title>Support — Frontend Challenge</title>
  <meta
    name="description"
    content="Frontend Challenge is free to use. Learn how you can support the project by contributing code, sharing, or buying a coffee."
  />
</svelte:head>

<PageContent width="medium">
  <PageHeader eyebrow="Free for everyone" title="Support Frontend Challenge">
    <p>
      Frontend Challenge is completely free for everyone. If you find it useful, any support is
      genuinely appreciated.
    </p>
  </PageHeader>

  <div class="ways">
    <article
      class="way-card"
      style:--hue-text="var(--topic-violet-text)"
      style:--hue-bg="var(--topic-violet-bg)"
    >
      <span class="way-icon" aria-hidden="true"><IconGithub /></span>
      <h2>Contribute on GitHub</h2>
      <p>
        Found a bug? Have an idea for a new feature or question? Open an issue or submit a pull
        request on GitHub.
      </p>
      <div class="actions">
        <ButtonLink
          kind="secondary"
          href="https://github.com/nealhorner/frontend-challenge"
          target="_blank"
          rel="noopener noreferrer"
        >
          View the Repository
        </ButtonLink>
      </div>
    </article>

    <article
      class="way-card"
      style:--hue-text="var(--topic-sky-text)"
      style:--hue-bg="var(--topic-sky-bg)"
    >
      <span class="way-icon" aria-hidden="true"><IconShare /></span>
      <h2>Share on Social Media</h2>
      <p>
        Tell your fellow developers about Frontend Challenge. Sharing the app helps the community
        grow and keeps the project alive.
      </p>
      <div class="actions">
        <ButtonLink
          kind="secondary"
          href="https://twitter.com/intent/tweet?text=Check%20out%20Frontend%20Challenge%20%E2%80%94%20a%20free%20app%20to%20test%20your%20JavaScript%2C%20CSS%2C%20and%20React%20skills!%20https%3A%2F%2Fgithub.com%2Fnealhorner%2Ffrontend-challenge"
          target="_blank"
          rel="noopener noreferrer"
        >
          Share on X
        </ButtonLink>
        <ButtonLink
          kind="secondary"
          href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fgithub.com%2Fnealhorner%2Ffrontend-challenge"
          target="_blank"
          rel="noopener noreferrer"
        >
          Share on LinkedIn
        </ButtonLink>
        <ButtonLink
          kind="secondary"
          href="https://bsky.app/intent/compose?text=Check%20out%20Frontend%20Challenge%20%E2%80%94%20a%20free%20app%20to%20test%20your%20JavaScript%2C%20CSS%2C%20and%20React%20skills!%20https%3A%2F%2Fgithub.com%2Fnealhorner%2Ffrontend-challenge"
          target="_blank"
          rel="noopener noreferrer"
        >
          Share on Bluesky
        </ButtonLink>
      </div>
    </article>

    <article
      class="way-card"
      style:--hue-text="var(--topic-amber-text)"
      style:--hue-bg="var(--topic-amber-bg)"
    >
      <span class="way-icon" aria-hidden="true"><IconCoffee /></span>
      <h2>Buy Me a Coffee</h2>
      <p>
        If you'd like to say thanks with a small donation, I'd really appreciate it. Every coffee
        helps keep the project running.
      </p>
      <div class="actions">
        <ButtonLink
          kind="primary"
          href="https://www.buymeacoffee.com/nealhorner"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconCoffee aria-hidden="true" />Buy Me a Coffee
        </ButtonLink>
      </div>
    </article>
  </div>
</PageContent>

<style>
  .ways {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(15rem, 100%), 1fr));
    gap: var(--space-lg);
  }

  .way-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
    padding: var(--space-lg);
    border: 1px solid var(--color-border-card);
    border-radius: var(--radius-card);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-card);
  }

  .way-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    margin-bottom: var(--space-xs);
    border-radius: var(--radius-button);
    background-color: var(--hue-bg);
    color: var(--hue-text);
    font-size: 1.25rem;
  }

  h2 {
    margin: 0;
    font-size: var(--text-xl);
  }

  .way-card p {
    flex: 1;
    margin: 0;
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
    line-height: 1.6;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    margin-top: var(--space-sm);
  }
</style>
