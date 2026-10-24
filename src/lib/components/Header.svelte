<script lang="ts">
  import { page } from '$app/state';
  import ButtonLink from '$lib/components/ButtonLink.svelte';
  import Logo from '$lib/components/Logo.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import LogoutButton from '$lib/components/auth/LogoutButton.svelte';
  import IconAccount from '~icons/mdi/account';
  import IconClose from '~icons/mdi/close';
  import IconMenu from '~icons/mdi/menu';

  let { isAuthenticated } = $props();

  let menuOpen = $state(false);
  let menuContainer: HTMLElement;
  let menuButton: HTMLButtonElement;

  let links = $derived([
    { href: '/', label: 'Home' },
    { href: '/learn', label: 'Learn' },
    ...(isAuthenticated ? [{ href: '/profile', label: 'Profile' }] : [])
  ]);

  function isCurrent(href: string) {
    const path = page.url.pathname;
    return href === '/' ? path === '/' : path === href || path.startsWith(href + '/');
  }

  function onWindowClick(event: MouseEvent) {
    // Close the mobile menu when clicking outside of it. Check the event path,
    // not event.target: toggling swaps the button icon, so the clicked <svg>
    // is already detached by the time this handler runs.
    if (menuOpen && !event.composedPath().includes(menuContainer)) {
      menuOpen = false;
    }
  }

  function onKeydown(event: KeyboardEvent) {
    // Close on Escape and return focus to the button, since the focused menu
    // link is removed along with the menu.
    if (event.key === 'Escape' && menuOpen) {
      menuOpen = false;
      menuButton?.focus();
    }
  }

  // Close on any menu link, including the current page's, where the pathname
  // effect below wouldn't fire.
  function closeMenu() {
    menuOpen = false;
  }

  // Close the mobile menu after navigating
  $effect(() => {
    void page.url.pathname;
    menuOpen = false;
  });
</script>

<svelte:window onclick={onWindowClick} onkeydown={onKeydown} />

<header>
  <div class="bar">
    <div class="start">
      <Logo />
      <nav class="nav-pill" aria-label="Main">
        {#each links as link (link.href)}
          <a href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>
            {link.label}
          </a>
        {/each}
      </nav>
    </div>

    <div class="end">
      <ThemeToggle />
      <div class="desktop-actions">
        {#if isAuthenticated}
          <LogoutButton />
          <a href="/profile" class="avatar" aria-label="Your profile"><IconAccount /></a>
        {:else}
          <ButtonLink href="/login" kind="ghost">Sign In</ButtonLink>
          <ButtonLink href="/quiz" kind="primary">Start a Quiz</ButtonLink>
        {/if}
      </div>

      <div class="menu" bind:this={menuContainer}>
        <button
          type="button"
          bind:this={menuButton}
          class="menu-button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onclick={() => (menuOpen = !menuOpen)}
        >
          {#if menuOpen}<IconClose />{:else}<IconMenu />{/if}
        </button>
        {#if menuOpen}
          <div id="mobile-menu" class="menu-panel">
            <nav aria-label="Main">
              {#each links as link (link.href)}
                <a
                  href={link.href}
                  aria-current={isCurrent(link.href) ? 'page' : undefined}
                  onclick={closeMenu}
                >
                  {link.label}
                </a>
              {/each}
            </nav>
            <div class="menu-actions">
              {#if isAuthenticated}
                <LogoutButton />
              {:else}
                <ButtonLink href="/login" kind="secondary" onclick={closeMenu}>Sign In</ButtonLink>
                <ButtonLink href="/quiz" kind="primary" onclick={closeMenu}>Start a Quiz</ButtonLink
                >
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</header>

<style>
  header {
    position: sticky;
    top: 0;
    z-index: 50;
    width: 100%;
    background-color: var(--color-header-bg);
    border-bottom: 1px solid var(--color-border);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
    height: 4rem;
    max-width: var(--page-content-max-width);
    margin: 0 auto;
    padding: 0 var(--page-content-padding);
  }

  .start,
  .end,
  .desktop-actions {
    display: flex;
    align-items: center;
  }

  .start {
    gap: var(--space-lg);
  }

  .end,
  .desktop-actions {
    gap: var(--space-sm);
  }

  /* ─── Desktop nav pill ─── */

  .nav-pill {
    display: flex;
    gap: 2px;
    padding: 3px;
    border-radius: var(--radius-xl);
    background-color: var(--color-surface-sunken);
  }

  .nav-pill a {
    padding: 0.3125rem 0.875rem;
    border-radius: var(--radius-button);
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
    font-weight: 500;
    text-decoration: none;
    transition:
      color var(--transition-fast),
      background-color var(--transition-fast);
  }

  .nav-pill a:hover {
    color: var(--color-text);
  }

  .nav-pill a[aria-current='page'] {
    background-color: var(--color-surface);
    color: var(--color-link);
    box-shadow: var(--shadow-sm);
  }

  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: var(--radius-full);
    border: 1px solid var(--color-border-strong);
    background-color: var(--color-surface-sunken);
    color: var(--color-text-secondary);
    font-size: 1.125rem;
  }

  .avatar:hover {
    color: var(--color-text);
    text-decoration: none;
  }

  /* ─── Mobile menu ─── */

  .menu {
    display: none;
    position: relative;
  }

  .menu-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-button);
    background-color: var(--color-surface);
    color: var(--color-text);
    font-size: 1.25rem;
    cursor: pointer;
  }

  .menu-panel {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    width: min(18rem, calc(100vw - 2rem));
    padding: var(--space-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-card);
    background-color: var(--color-surface-raised);
    box-shadow: var(--shadow-overlay);
  }

  .menu-panel nav {
    display: flex;
    flex-direction: column;
  }

  .menu-panel nav a {
    padding: 0.625rem 0.75rem;
    border-radius: var(--radius-button);
    color: var(--color-text);
    font-weight: 500;
    text-decoration: none;
  }

  .menu-panel nav a:hover {
    background-color: var(--color-surface-sunken);
  }

  .menu-panel nav a[aria-current='page'] {
    background-color: var(--color-primary-soft);
    color: var(--color-link);
  }

  .menu-actions {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  @media (max-width: 767px) {
    .nav-pill,
    .desktop-actions {
      display: none;
    }

    .menu {
      display: block;
    }
  }
</style>
