<script lang="ts">
  interface Props {
    username: string;
    rating: number;
    profilePhoto?: string;
  }
  let { username, rating, profilePhoto = '/images/profile/default-profile.png' }: Props = $props();
</script>

<section class="profile-header">
  <img
    class="profile-photo"
    src={profilePhoto}
    alt={`${username}'s Profile Photo`}
    width="96"
    height="96"
  />
  <div class="identity">
    <span class="eyebrow">Your profile</span>
    <h1 class="username">{username}</h1>
    <div class="rating"><span class="rating-label">Rating</span> {rating}</div>
  </div>
</section>

<style>
  .profile-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
  }

  .profile-photo {
    flex-shrink: 0;
    width: 96px;
    height: 96px;
    border: 3px solid var(--color-surface);
    border-radius: var(--radius-full);
    background-color: var(--color-surface-sunken);
    box-shadow:
      0 0 0 1px var(--color-primary-border),
      var(--shadow-raised);
    object-fit: cover;
  }

  .identity {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-xs);
    min-width: 0;
  }

  .eyebrow {
    color: var(--color-link);
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .username {
    margin: 0;
    font-size: var(--text-3xl);
    line-height: 1.2;
    overflow-wrap: anywhere;
  }

  .rating {
    padding: 0.125rem 0.625rem;
    border: 1px solid var(--color-primary-border);
    border-radius: var(--radius-full);
    background-color: var(--color-primary-soft);
    color: var(--color-link);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    font-weight: 700;
  }

  .rating-label {
    color: var(--color-text-secondary);
    font-weight: 500;
  }
</style>
