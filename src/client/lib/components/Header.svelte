<script>
  let links = [
    { text: 'Home', url: '/' },
  ];
</script>

<header>
  <h2>Frontend Challenge</h2>
  <nav>
    <ul>
      {#each links as link}
        <li><a href={link.url}>{link.text}</a></li>
      {/each}
    </ul>
  </nav>
</header>

<style>
  header {
    background-color: #4974a5;
    padding: 10px;
    border-bottom: 1px solid #494949;
  }

  h2 {
    display: inline;
  }

  nav ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  nav ul li {
    display: inline-block;
    margin-right: 10px;
  }

  nav ul li a {
    text-decoration: none;
    color: #333;
  }
</style>
