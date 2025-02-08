<script lang="ts">
  import ButtonLink from './ButtonLink.svelte';

  const images = Array(9)
    .fill(0)
    .map((_, i) => `welcome-icons/icon-${i + 1}.svg`);
</script>

<div class="welcome-section">
  <div class="welcome-content">
    <div id="welcome-animation">
      <div class="vertical-center">
        <div>
          <div class="icon-grid">
            {#each images as image, i}
              <img
                class="welcome-icon"
                src={image}
                alt={`Decorative Web Development Icon ${i + 1}`}
              />
            {/each}
          </div>
        </div>
      </div>
    </div>
    <div id="welcome-message">
      <div class="vertical-center">
        <p>Get ready to test your frontend knowledge. Track and improve your skills!</p>
        <div id="button-tray">
          <ButtonLink href="/quiz" kind="primary">Get Started</ButtonLink>
          <ButtonLink href="/register" kind="secondary">I Already Have an Account</ButtonLink>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .welcome-section {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px 0px;
    margin: 0 auto;
    height: calc(100vh - 62px);
    min-height: 200px;
    width: 100%;
    max-width: var(--page-content-max-width);
  }
  .welcome-content {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .welcome-content > div {
    height: 100%;
    width: 100%;
    border: 1px solid rgb(249, 158, 0);
  }
  .vertical-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    border: 1px solid red;
  }
  #button-tray {
    gap: 10px;
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
  }
  .icon-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  .icon-grid img {
    width: 100%;
    height: auto;
  }

  .welcome-icon {
    transition: all 200ms ease-out;
    opacity: 0.9;
  }
  .welcome-icon:hover {
    transition: all 200ms ease-in;
    transform: scale(1.05);
    opacity: 1;
  }

  /* Desktop layout */
  @media (min-width: 768px) {
    .welcome-content {
      flex-direction: row;
    }
  }
</style>
