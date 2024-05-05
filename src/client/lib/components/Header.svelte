<script>
  let links = [{ text: 'Home', url: '/' }];
</script>

<header>
  <h2>Frontend Challenge</h2>
  <nav>
    <ul>
      {#each links as link}
        <li><a href={link.url}>{link.text}</a></li>
      {/each}
    </ul>
    <button class="toggle-btn"></button>
  </nav>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #4974a5;
    border-bottom: 2px solid #494949;
    padding: 5px 20px;
  }

  nav ul {
    display: flex;
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  nav ul li {
    margin-right: 20px;
  }

  .toggle-btn {
    display: none;
  }

  /* Mobile layout */
  @media (max-width: 768px) {
    nav ul {
      display: none;
    }

    /* Toggle button for mobile */
    .toggle-btn {
      display: block;
      cursor: pointer;
      background-color: #f8f9fa;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
    }

    .toggle-btn:hover {
      background-color: #e9ecef;
    }

    .toggle-btn::after {
      content: '\2630'; /* Unicode for hamburger icon */
      font-size: 24px;
    }

    .nav-open {
      display: block;
    }
  }
</style>
