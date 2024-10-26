<script lang="ts">
  import LoginButton from './LoginButton.svelte';
  import LogoutButton from './LogoutButton.svelte';
  let showVerticalMenu = false;
  let loggedIn = false;
  let clickContainer: HTMLDivElement;
  let innerWidth = 0;

  function onWindowClick(event: MouseEvent) {
    // Hide the vertical menu when clicking outside of it
    const target = event.target as Node;
    if (!clickContainer.contains(target)) {
      showVerticalMenu = false;
    }
  }

  function handleClick() {
    // Show vertical nav menu when the menu button is clicked
    showVerticalMenu = !showVerticalMenu;
  }

  $: showVerticalMenu = innerWidth <= 768 ? showVerticalMenu : false;
</script>

<svelte:window on:click={onWindowClick} bind:innerWidth />

<header>
  <div id="nav-wrapper">
    <a href="/"><h2>Frontend Challenge</h2></a>
    <div style="height: 45px">
      <nav>
        <div class="horizontal-nav">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/learn">Learn</a></li>
            {#if loggedIn}
              <li><a href="/profile">Profile</a></li>
            {/if}
          </ul>
          <div>
            {#if !loggedIn}
              <LoginButton />
            {:else}
              <LogoutButton />
            {/if}
          </div>
        </div>
        <div class="click-container" bind:this={clickContainer}>
          <div class="toggle-btn-wrapper">
            <button class="toggle-btn" on:click={handleClick}></button>
          </div>
          <div style="display: {showVerticalMenu ? 'flex' : 'none'};">
            <div class="vertical-nav">
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/learn">Learn</a></li>
                {#if loggedIn}
                  <li><a href="/profile">Profile</a></li>
                {/if}
              </ul>
              <div>
                {#if loggedIn}
                  <LogoutButton />
                {:else}
                  <LoginButton />
                {/if}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
  <div class="border pink"></div>
  <div class="border orange"></div>
  <div class="border yellow"></div>
</header>

<style>
  header {
    width: 100%;
    background-color: var(--color-blue);
  }
  #nav-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px var(--page-content-padding);
    width: 100%;
    margin: 0 auto;
    max-width: var(--page-content-max-width);
  }

  h2 {
    color: var(--color-yellow);
    text-shadow: 1px 1px var(--color-orange);
    font-size: 2.5rem;
    margin: auto 0;
  }

  #nav-wrapper > div {
    height: 45px;
    display: flex;
    align-items: center;
  }

  .horizontal-nav {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
    gap: 0px 20px;
  }

  .horizontal-nav ul {
    list-style: none;
    display: flex;
    gap: 0px 20px;
  }

  .horizontal-nav ul li a {
    color: var(--color-yellow);
    text-decoration: none;
  }

  nav ul {
    list-style: none;
    display: flex;
    padding: 0;
    margin: 0;
  }

  .toggle-btn-wrapper {
    display: none;
    align-items: center;
    height: 45px;
  }

  .toggle-btn {
    display: block; /* Hide by default */
    background: url('hamburger-button.png') no-repeat center center;
    background-size: contain;
    border: none;
    margin-left: 10px;
    height: 30px;
    width: 30px;
    cursor: pointer;
  }

  .vertical-nav {
    display: none; /* Hide by default */
    flex-direction: column;
    position: absolute;
    gap: 10px 0px;
    top: 10;
    right: 0;
    padding: 10px;
    background-color: white;
    z-index: 1;
  }

  .vertical-nav ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px 0px;
    padding: 0;
    margin: 0;
  }

  .vertical-nav ul li a {
    color: black;
    text-decoration: none;
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

  @media (max-width: 768px) {
    .toggle-btn-wrapper {
      display: flex; /* Show button on narrow screens */
    }

    .horizontal-nav {
      display: none; /* Hide the menu when toggled */
    }

    .vertical-nav {
      display: flex;
    }
  }
</style>
