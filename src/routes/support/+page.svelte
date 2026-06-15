<svelte:head>
  <title>Support — Frontend Challenge</title>
  <meta
    name="description"
    content="Frontend Challenge is free to use. Learn how you can support the project by contributing code, sharing, or buying a coffee."
  />
  <script
    type="text/javascript"
    src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
    data-name="bmc-button"
    data-slug="nealhorner"
    data-color="#FFDD00"
    data-emoji=""
    data-font="Cookie"
    data-text="Buy me a coffee"
    data-outline-color="#000000"
    data-font-color="#000000"
    data-coffee-color="#ffffff"
  ></script>
</svelte:head>

<div class="page">
  <div class="inner">
    <h1>Support Frontend Challenge</h1>
    <p class="subtitle">
      Frontend Challenge is completely free — no paywalls, no subscriptions. If you find it useful,
      any support is genuinely appreciated.
    </p>

    <div class="ways">
      <div class="way-card">
        <div class="way-icon">&#128187;</div>
        <h2>Contribute on GitHub</h2>
        <p>
          Found a bug? Have an idea for a new feature or question? Open an issue or submit a pull
          request on GitHub.
        </p>
        <a
          class="link-btn"
          href="https://github.com/nealhorner/frontend-challenge"
          target="_blank"
          rel="noopener noreferrer"
        >
          View the Repository
        </a>
      </div>

      <div class="way-card">
        <div class="way-icon">&#128172;</div>
        <h2>Share on Social Media</h2>
        <p>
          Tell your fellow developers about Frontend Challenge. Sharing the app helps the community
          grow and keeps the project alive.
        </p>
        <div class="share-links">
          <a
            class="link-btn secondary"
            href="https://twitter.com/intent/tweet?text=Check%20out%20Frontend%20Challenge%20%E2%80%94%20a%20free%20app%20to%20test%20your%20JavaScript%2C%20CSS%2C%20and%20React%20skills!%20https%3A%2F%2Fgithub.com%2Fnealhorner%2Ffrontend-challenge"
            target="_blank"
            rel="noopener noreferrer"
          >
            Share on X
          </a>
          <a
            class="link-btn secondary"
            href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fgithub.com%2Fnealhorner%2Ffrontend-challenge"
            target="_blank"
            rel="noopener noreferrer"
          >
            Share on LinkedIn
          </a>
        </div>
      </div>

      <div class="way-card">
        <div class="way-icon">&#9749;</div>
        <h2>Buy Me a Coffee</h2>
        <p>
          If you'd like to say thanks with a small donation, I'd really appreciate it. Every coffee
          helps keep the project running.
        </p>
        <a
          href="https://www.buymeacoffee.com/nealhorner"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me a Coffee"
            style="height: 60px !important; width: 217px !important;"
          />
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  .page {
    padding: 56px var(--page-content-padding);
    flex: 1;
  }

  .inner {
    max-width: 860px;
    margin: 0 auto;
  }

  h1 {
    font-size: clamp(1.8rem, 5vw, 2.4rem);
    font-weight: 500;
    color: var(--color-blue);
    margin: 0 0 16px;
  }

  .subtitle {
    font-size: 1.05rem;
    color: var(--color-text);
    line-height: 1.6;
    margin: 0 0 48px;
    max-width: 600px;
  }

  .ways {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px;
  }

  .way-card {
    background: white;
    border: 1px solid var(--color-border);
    border-radius: var(--card-border-radius);
    padding: 32px 28px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  }

  .way-icon {
    font-size: 2rem;
    line-height: 1;
  }

  h2 {
    font-size: 1.15rem;
    font-weight: 500;
    color: var(--color-purple);
    margin: 0;
  }

  p {
    color: var(--color-text);
    line-height: 1.6;
    margin: 0;
    font-size: 0.95rem;
    flex: 1;
  }

  .share-links {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .link-btn {
    display: inline-block;
    padding: 10px 18px;
    background-color: var(--color-blue);
    color: var(--color-yellow);
    text-decoration: none;
    border-radius: var(--border-radius-md);
    font-size: 0.9rem;
    transition: opacity 0.15s;
  }

  .link-btn:hover {
    opacity: 0.85;
  }

  .link-btn.secondary {
    background-color: var(--color-purple);
    color: white;
  }

  @media (max-width: 600px) {
    .page {
      padding: 40px 20px;
    }
  }
</style>
