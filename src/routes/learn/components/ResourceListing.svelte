<script lang="ts">
  export let url = '';
  export let title = '';
</script>

<a href={url}>
  <div>
    <h3>{title}</h3>
    <p>{url}</p>
  </div>
</a>

<style>
  a {
    text-decoration: none;
    color: black;
  }

  div {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    box-shadow:
      0px 1px 2px -1px rgba(0, 0, 0, 0.1),
      0px 1px 3px 0px rgba(0, 0, 0, 0.1);
    padding: 10px;
  }

  div:hover {
    transform: translateY(-1px) translateX(-1px);
    color: var(--color-orange);
  }

  h3 {
    margin: 0;
  }

  p {
    margin: 0;
  }
</style>
