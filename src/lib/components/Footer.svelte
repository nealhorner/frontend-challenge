<footer>
  <div class="footer-inner">
    <p>&copy; Frontend Challenge {new Date().getFullYear()}</p>
    <nav>
      <a href="/">Home</a>
    </nav>
  </div>
</footer>

<style>
  footer {
    width: 100%;
    background-color: white;
    border-top: 1px solid var(--color-border);
  }

  .footer-inner {
    padding: var(--page-content-padding);
    width: 100%;
    max-width: var(--page-content-max-width);
    margin: 0 auto;
    text-align: center;
  }

  p {
    color: var(--color-text);
  }

  a {
    margin: 0 1rem;
    color: var(--color-purple);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
