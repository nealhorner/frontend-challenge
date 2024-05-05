<script>
  import LoginButton from './LoginButton.svelte';
  import LogoutButton from './LogoutButton.svelte';
  let showMenu = false;
  let loggedIn = true;

  function handleClick() {
    showMenu = !showMenu;
    console.log(showMenu);
  }
</script>

<header>
  <div id="nav-wrapper">
    <a href="/"><h2>Frontend Challenge</h2></a>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        {#if loggedIn === true}
          <li><a href="/profile">Profile</a></li>
        {/if}
      </ul>
      <button class="toggle-btn" onclick={handleClick}></button>
      <div id="menu" class={showMenu ? 'show-menu' : ''}>hi</div>
    </nav>
    <div>
      {#if loggedIn === false}
        <LoginButton />
      {:else}
        <LogoutButton />
      {/if}
    </div>
  </div>
  <div class="border pink"></div>
  <div class="border orange"></div>
  <div class="border yellow"></div>
</header>

<style>
  #nav-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--color-blue);
    padding: 5px 20px;
  }

  h2 {
    color: var(--color-yellow);
    text-shadow: 1px 1px var(--color-orange);
    font-size: 2.5rem;
    margin: auto 0;
  }

  nav ul {
    display: flex;
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  nav ul li {
    margin-right: 20px;
    color: var(--color-orange);
  }

  nav ul li a {
    text-decoration: none;
    color: var(--color-orange);
  }

  .toggle-btn {
    display: none;
  }

  #menu {
    display: none;
  }

  .border {
    height: 2px;
    width: 100%;
    background-color: aqua;
  }

  .border.yellow {
    background-color: var(--color-yellow);
  }

  .border.orange {
    background-color: var(--color-orange);
  }

  .border.pink {
    background-color: var(--color-pink);
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

    #menu.show-menu {
      display: block;
      position: absolute;
      top: 60px;
      right: 0;
      background-color: #f8f9fa;
      border: 1px solid #ced4da;
      border-radius: 5px;
      padding: 10px;
    }
  }
</style>
