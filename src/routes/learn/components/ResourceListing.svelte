<script lang="ts">
  import { toPlainText } from '$lib/text';
  interface Props {
    title?: string;
    url?: string;
    description?: string | null;
    imageURL?: string | null;
  }

  let { title = '', url = '', description = '', imageURL = '' }: Props = $props();

  let safeURL = $derived(/^https?:\/\//i.test(url) ? url : '');
  let displayURL = $derived(safeURL.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, ''));
  // Descriptions are scraped from other sites, so show them as plain text
  let plainDescription = $derived(description ? toPlainText(description) : '');
</script>

<a href={safeURL || '#'} target="_blank" rel="noopener noreferrer" class="card-link">
  <div class="card">
    <div class="resource-content">
      <h3>{title}</h3>
      {#if plainDescription}
        <p class="resource-description">{plainDescription}</p>
      {/if}
      <p class="link-text">
        <svg
          class="link-icon"
          viewBox="0 0 12 12"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M3.5 3a.5.5 0 0 0 0 1H7.29L2.15 9.15a.5.5 0 1 0 .7.7L8 4.71V8.5a.5.5 0 0 0 1 0v-5a.5.5 0 0 0-.5-.5h-5z"
          />
        </svg>
        {displayURL}
      </p>
    </div>
    {#if imageURL}
      <div class="resource-image">
        <div style="background-image: url({imageURL})"></div>
      </div>
    {/if}
  </div>
</a>

<style>
  .card-link {
    display: block;
    height: 100%;
    border-radius: var(--radius-card);
    color: var(--color-text);
    text-decoration: none;
  }

  .card {
    display: flex;
    align-items: stretch;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 1px solid var(--color-border-card);
    border-radius: var(--radius-card);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-sm);
    color: var(--color-text);
    transition:
      border-color var(--transition-fast),
      background-color var(--transition-fast),
      box-shadow var(--transition-fast);
  }

  .card-link:hover {
    text-decoration: none;
  }

  .card-link:hover .card {
    border-color: var(--color-primary-border);
    background-color: var(--color-surface-raised);
    box-shadow: var(--shadow-raised);
  }

  .resource-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 0.375rem;
    min-width: 0;
    padding: var(--space-md);
  }

  h3 {
    margin: 0;
    overflow: hidden;
    color: var(--color-text);
    font-size: var(--text-md);
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  p {
    margin: 0;
  }

  p.resource-description {
    display: -webkit-box;
    overflow: hidden;
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
    line-height: 1.45;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  p.link-text {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-top: auto;
    overflow: hidden;
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card-link:hover p.link-text {
    color: var(--color-link);
  }

  .link-icon {
    flex-shrink: 0;
    width: 10px;
    height: 10px;
    fill: currentColor;
  }

  .resource-image {
    position: relative;
    display: flex;
    flex-shrink: 0;
    width: 120px;
  }

  .resource-image > div {
    position: absolute;
    inset: 0;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    transition: transform 0.2s ease-in-out;
  }

  .card-link:hover .resource-image > div {
    transform: scale(1.05);
  }
</style>
