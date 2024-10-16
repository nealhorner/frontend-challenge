<script lang="ts">
  export let title = '';
  export let url = '';
  export let description = '' as string | null;
  export let imageURL = '' as string | null;

  // Remove the protocol from the URL and the trailing slash
  const displayURL = url.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '');
</script>

<a href={url} target="_blank">
  <div class="card">
    <div class="resource-content">
      <h3>{title}</h3>
      {#if description}
        <p class="resource-description">{@html description}</p>
      {/if}
      <p><a href={url} target="_blank">{displayURL}</a></p>
    </div>
    {#if imageURL}
      <div class="resource-image">
        <div style="background-image: url({imageURL})"></div>
      </div>
    {/if}
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

  div.card {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: var(--card-border-radius);
    box-shadow:
      0px 1px 2px -1px rgba(0, 0, 0, 0.1),
      0px 1px 3px 0px rgba(0, 0, 0, 0.1);
    color: #333;
    background-color: #fff;
    overflow: hidden;
    display: flex;
    align-items: stretch;
    width: 100%;
  }

  div.card:hover {
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow:
      0px 1px 2px -1px rgba(0, 0, 0, 0.2),
      0px 1px 3px 0px rgba(0, 0, 0, 0.2);
  }

  div.resource-image {
    width: 170px;
    display: flex;
    flex-shrink: 0;
    position: relative;
  }

  div.resource-image > div {
    width: 170px;
    position: absolute;
    top: 0;
    right: -10px;
    bottom: 0;
    background-size: cover;
    background-position-y: center;
    background-position-x: left;
    background-repeat: no-repeat;
    transition: all 0.2s ease-in-out;
  }

  div.card:hover div.resource-image > div {
    /* width: 150px; */
    transform: scale(1.05) translateX(-5px);
  }

  div.resource-image > div::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.1) 80%,
      rgba(150, 150, 150, 0.5) 92%,
      rgba(150, 150, 150, 0.9) 100%
    );
  }

  div.resource-content {
    flex-grow: 1;
    padding: 10px;
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
