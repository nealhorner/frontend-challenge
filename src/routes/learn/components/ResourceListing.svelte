<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */

  interface Props {
    title?: string;
    url?: string;
    description?: string | null;
    imageURL?: string | null;
  }

  let { title = '', url = '', description = '', imageURL = '' }: Props = $props();

  let safeURL = $derived(/^https?:\/\//i.test(url) ? url : '');
  let displayURL = $derived(safeURL.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, ''));
</script>

<a href={safeURL || '#'} target="_blank" rel="noopener noreferrer" class="card-link">
  <div class="card">
    <div class="resource-content">
      <h3>{title}</h3>
      {#if description}
        <p class="resource-description">{@html description}</p>
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
    text-decoration: none;
    color: var(--ocean-color-charcoal);
    display: block;
    height: 100%;
  }

  .card {
    border: 1px solid var(--color-border);
    border-radius: var(--card-border-radius);
    box-shadow:
      0px 1px 2px -1px rgba(0, 0, 0, 0.08),
      0px 1px 3px 0px rgba(0, 0, 0, 0.06);
    color: var(--ocean-color-charcoal);
    background-color: var(--ocean-color-white);
    overflow: hidden;
    display: flex;
    align-items: stretch;
    width: 100%;
    height: 100%;
    transition:
      box-shadow 0.15s ease,
      border-color 0.15s ease;
  }

  .card:hover {
    border-color: rgba(0, 0, 0, 0.18);
    box-shadow:
      0px 4px 8px -2px rgba(0, 0, 0, 0.1),
      0px 2px 4px 0px rgba(0, 0, 0, 0.06);
  }

  .resource-content {
    flex-grow: 1;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    color: var(--color-blue);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    margin: 0;
  }

  p.resource-description {
    font-size: 0.82rem;
    color: var(--color-text-secondary);
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  p.link-text {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.78rem;
    color: var(--color-text-tertiary);
    margin-top: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card:hover p.link-text {
    color: var(--color-blue);
  }

  .link-icon {
    width: 10px;
    height: 10px;
    fill: currentColor;
    flex-shrink: 0;
  }

  .resource-image {
    width: 120px;
    display: flex;
    flex-shrink: 0;
    position: relative;
  }

  .resource-image > div {
    width: 100%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: transform 0.2s ease-in-out;
  }

  .card:hover .resource-image > div {
    transform: scale(1.05);
  }

  .resource-image > div::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.05) 0%,
      rgba(255, 255, 255, 0) 60%,
      rgba(200, 200, 200, 0.4) 100%
    );
  }
</style>
