<script lang="ts">
  interface Props {
    username: string;
    rating: number;
    profilePhoto?: string;
  }
  let { username, rating, profilePhoto = 'images/profile/default-profile.png' }: Props = $props();
</script>

<section class="profile-header">
  <img
    class="profile-photo"
    src={profilePhoto}
    alt={`${username}'s Profile Photo`}
    width="160"
    height="160"
  />
  <div>
    <h1 class="username">{username}</h1>
    <div class="rating">Rating {rating}</div>
  </div>
</section>

<style>
  .profile-header {
    display: flex;
    align-items: end;
    gap: 1rem;
    margin: 20px 0;
    text-align: left;
  }
  .profile-photo {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    object-fit: cover;
    background-color: azure;
  }
  .username {
    font-size: 24px;
    font-weight: 600;
  }
  .rating {
    font-size: 20px;
  }
</style>
