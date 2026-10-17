<script lang="ts">
  import { page } from '$app/state';
  import Logo from '$lib/components/Logo.svelte';

  const links = [
    { href: '/', label: 'Home' },
    { href: '/feedback', label: 'Feedback' },
    { href: '/support', label: 'Support' }
  ];
</script>

<footer>
  <div class="footer-inner">
    <div class="brand">
      <Logo size="sm" />
      <span class="divider" aria-hidden="true">•</span>
      <p>&copy; Frontend Challenge {new Date().getFullYear()}. Built for frontend mastery.</p>
    </div>
    <nav aria-label="Footer">
      {#each links as link (link.href)}
        <a href={link.href} aria-current={page.url.pathname === link.href ? 'page' : undefined}>
          {link.label}
        </a>
      {/each}
    </nav>
  </div>
</footer>

<style>
  footer {
    width: 100%;
    margin-top: var(--space-xl);
    border-top: 1px solid var(--color-border);
    background-color: var(--color-surface);
  }

  .footer-inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md) var(--space-lg);
    max-width: var(--page-content-max-width);
    margin: 0 auto;
    padding: var(--space-xl) var(--page-content-padding);
  }

  .brand {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-sm) var(--space-md);
  }

  .divider {
    color: var(--color-text-muted);
  }

  p {
    margin: 0;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
  }

  nav {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-lg);
  }

  nav a {
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
    text-decoration: none;
  }

  nav a:hover {
    color: var(--color-text);
  }

  nav a[aria-current='page'] {
    color: var(--color-link);
    font-weight: 500;
  }

  @media (max-width: 767px) {
    .footer-inner,
    .brand {
      flex-direction: column;
      text-align: center;
    }

    .divider {
      display: none;
    }
  }
</style>
