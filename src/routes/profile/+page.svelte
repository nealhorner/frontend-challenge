<script lang="ts">
  import type { PageServerData, ActionData } from './$types';
  import ProfileInfo from './components/profileInfo.svelte';
  import ProfileHeader from './components/ProfileHeader.svelte';
  import ProfileBio from './components/ProfileBio.svelte';
  import { faBuilding, faGlobe, faLocationDot } from '@fortawesome/free-solid-svg-icons';
  import { faGithub, faLinkedin, faBluesky, faXTwitter } from '@fortawesome/free-brands-svg-icons';
  import Button from '$lib/components/Button.svelte';
  import { enhance } from '$app/forms';
  import ErrorMessage from '$lib/components/form/ErrorMessage.svelte';
  import PageContent from '$lib/components/PageContent.svelte';
  import ProfileStats from './components/ProfileStats.svelte';

  interface Props {
    data: PageServerData;
    form: ActionData;
  }

  let { data, form }: Props = $props();
  let userAuthenticated = $derived(data.userAuthenticated);
  let userDetail = $derived(data.userDetail);
  let userStats = $derived(data.userStats);

  let profilePhoto: string | undefined = undefined; // TODO - get profile photo from data

  let edit = $state(false);
  let confirmDeleteAccount = $state(false);
</script>

<svelte:head>
  <title>Frontend Challenge Profile</title>
  <meta name="description" content="Profile for Frontend Challenge" />
</svelte:head>

<PageContent>
  <ProfileHeader username={userAuthenticated.name} rating={userStats.eloRating} {profilePhoto} />
  <div>
    <ProfileBio />
    <ProfileStats
      completedQuizzes={userStats.totalQuizzesTaken}
      accuracy={userStats.totalQuestionsAnswered === 0
        ? 0
        : userStats.totalCorrectAnswers / userStats.totalQuestionsAnswered}
      rank={userStats.rank}
      currentStreak={userStats.currentStreak}
      longestStreak={userStats.longestStreak}
    />
  </div>

  <section>
    {#if edit}
      <form>
        <!-- TODO add submit event handling-->
        <!--TODO Name should only be able to be changed every 30 days -->
        <label for="name">Name</label>
        <input type="text" id="name" required />
        <!--TODO Email should only be able to be changed every 30 days -->
        <label for="email">Email:</label>
        <input type="email" id="email" required />

        <label for="company">Company</label>
        <input type="text" id="company" placeholder="company" />
        <label for="website">Website</label>
        <input type="text" id="website" placeholder="website" />
        <label for="location">Location</label>
        <input type="text" id="location" placeholder="location" />

        <label for="github">GitHub</label>
        <input type="text" id="github" placeholder="github" />
        <label for="linkedin">LinkedIn</label>
        <input type="text" id="linkedin" placeholder="linkedin" />
        <label for="twitter">Twitter</label>
        <input type="text" id="twitter" placeholder="twitter" />
        <label for="bluesky">BlueSky</label>
        <input type="text" id="bluesky" placeholder="bluesky" />
        <!-- TODO - handle submit and cancel -->
        <button type="submit">Save</button><button type="reset">Cancel</button>
      </form>
    {:else}
      <ProfileInfo text={userDetail?.company} faIcon={faBuilding} title="Company" optional />
      <ProfileInfo text={userDetail?.website} faIcon={faGlobe} title="Website " optional />
      <ProfileInfo
        text={data.userDetail?.location}
        faIcon={faLocationDot}
        title="Location"
        optional
      />
      <ProfileInfo
        text={data.userDetail?.github}
        faIcon={faGithub}
        title="GitHub Profile Link"
        optional
      />
      <ProfileInfo
        text={data.userDetail?.linkedIn}
        faIcon={faLinkedin}
        title="LinkedIn Profile Link"
        optional
      />
      <ProfileInfo
        text={data.userDetail?.twitter}
        faIcon={faXTwitter}
        title="X (Twitter) Profile Link"
        optional
      />
      <ProfileInfo
        text={data.userDetail?.bluesky}
        faIcon={faBluesky}
        title="BlueSky Profile Link"
        optional
      />
      <button onclick={() => (edit = true)}>Edit Settings</button>
    {/if}
  </section>

  <section>
    <h2>Achievements</h2>
    <!--TODO Number of quizzes completed -->
    <!--TODO Days of participation -->
    <!--TODO Rank -->
  </section>

  <section>
    <h2>Stats</h2>
    <!--TODO Number of quizzes completed -->
    <!--TODO Days of participation -->
    <!--TODO Rank -->
    <!--TODO Time Map -->
    <!--TODO Rank, Question Difficulty, Speed over time -->
  </section>

  <section id="danger-section">
    <h2>Danger</h2>
    {#if confirmDeleteAccount}
      <form action="?/deleteAccount" method="POST" use:enhance>
        <p>
          Are you sure you want to delete your account? Your data can't be recovered if you delete
          your account.
        </p>
        {#if form?.deleteAccountUnauthorized}<ErrorMessage errorMessage={form.message} />{/if}
        {#if form?.deleteAccountIncorrectEmail}<ErrorMessage errorMessage={form.message} />{/if}
        <label for="confirmDeleteAccount"
          >Type your email address, {userAuthenticated.email}, to confirm</label
        >
        <input type="text" id="confirmDeleteAccount" name="email" autocomplete="off" required />
        <div>
          <Button type="reset" kind="secondary" onclick={() => (confirmDeleteAccount = false)}
            >Cancel</Button
          >
          <Button type="submit" kind="warning">Confirm Delete Account</Button>
        </div>
      </form>
    {:else}
      <Button type="button" kind="warning" onclick={() => (confirmDeleteAccount = true)}
        >Delete Account</Button
      >
    {/if}
  </section>
</PageContent>

<style>
  h2 {
    margin-top: 1rem;
    font-weight: 600;
    font-size: 1.5rem;
  }
  #danger-section h2 {
    color: var(--color-red);
  }
</style>
