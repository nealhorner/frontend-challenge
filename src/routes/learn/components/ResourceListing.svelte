<script lang="ts">
  import { decodeHTML } from '$lib/utilities/decodeHTML';
  import { cleanUnsafeHTML } from '$lib/utilities/cleanUnsafeHTML';

  export let title = '';
  export let url = '';
  export let description = '' as string | null;

  // Remove the protocol from the URL and the trailing slash
  const displayURL = url.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '');

  // Sanitize the description
  if (description) {
    let decodedHTML = decodeHTML(description);
    description = cleanUnsafeHTML(decodedHTML);
  }
</script>

<a href={url} target="_blank">
  <div>
    <h3>{title}</h3>
    {#if description}
      <p class="resource-description">{@html description}</p>
    {/if}
    <p><a href={url} target="_blank">{displayURL}</a></p>
  </div>
</a>

<style>
  a {
    text-decoration: none;
    color: #333;
  }

  p > a:hover {
    text-decoration: underline;
    color: var(--color-blue);
  }

  div {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    box-shadow:
      0px 1px 2px -1px rgba(0, 0, 0, 0.1),
      0px 1px 3px 0px rgba(0, 0, 0, 0.1);
    padding: 10px;
    color: #333;
  }

  h3 {
    margin: 0;
  }

  p {
    margin: 0;
  }

  p.resource-description {
    font-size: smaller;
  }
</style>
