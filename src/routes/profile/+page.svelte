<script lang="ts">
  import type { PageServerData, ActionData } from './$types';
  import ProfileInfo from './components/profileInfo.svelte';
  import ProfileHeader from './components/ProfileHeader.svelte';
  import ProfileBio from './components/ProfileBio.svelte';
  import { Building, Globe, MapPin } from 'lucide-svelte';
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

  let hasDetails = $derived(
    [
      userDetail?.company,
      userDetail?.website,
      userDetail?.location,
      userDetail?.github,
      userDetail?.linkedIn,
      userDetail?.twitter,
      userDetail?.bluesky
    ].some(Boolean)
  );

  let edit = $state(false);
  let confirmDeleteAccount = $state(false);
</script>

<svelte:head>
  <title>Profile — Frontend Challenge</title>
  <meta name="description" content="Profile for Frontend Challenge" />
</svelte:head>

<PageContent>
  <ProfileHeader username={userAuthenticated.name} rating={userStats.eloRating} {profilePhoto} />
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

  <section class="panel">
    <h2>Profile Details</h2>
    {#if edit}
      <form class="details-form">
        <!-- TODO add submit event handling-->
        <!--TODO Name should only be able to be changed every 30 days -->
        <div class="form-field">
          <label for="name">Name</label>
          <input class="form-input" type="text" id="name" required />
        </div>
        <!--TODO Email should only be able to be changed every 30 days -->
        <div class="form-field">
          <label for="email">Email</label>
          <input class="form-input" type="email" id="email" required />
        </div>
        <div class="form-field">
          <label for="company">Company</label>
          <input class="form-input" type="text" id="company" placeholder="Company" />
        </div>
        <div class="form-field">
          <label for="website">Website</label>
          <input class="form-input" type="text" id="website" placeholder="Website" />
        </div>
        <div class="form-field">
          <label for="location">Location</label>
          <input class="form-input" type="text" id="location" placeholder="Location" />
        </div>
        <div class="form-field">
          <label for="github">GitHub</label>
          <input class="form-input" type="text" id="github" placeholder="GitHub" />
        </div>
        <div class="form-field">
          <label for="linkedin">LinkedIn</label>
          <input class="form-input" type="text" id="linkedin" placeholder="LinkedIn" />
        </div>
        <div class="form-field">
          <label for="twitter">Twitter</label>
          <input class="form-input" type="text" id="twitter" placeholder="Twitter" />
        </div>
        <div class="form-field">
          <label for="bluesky">BlueSky</label>
          <input class="form-input" type="text" id="bluesky" placeholder="BlueSky" />
        </div>
        <!-- TODO - handle submit -->
        <div class="form-actions">
          <Button type="submit" kind="primary">Save</Button>
          <Button kind="ghost" onclick={() => (edit = false)}>Cancel</Button>
        </div>
      </form>
    {:else}
      {#if hasDetails}
        <div class="details">
          <ProfileInfo text={userDetail?.company} icon={Building} title="Company" optional />
          <ProfileInfo text={userDetail?.website} icon={Globe} title="Website" optional />
          <ProfileInfo text={data.userDetail?.location} icon={MapPin} title="Location" optional />
          <ProfileInfo
            text={data.userDetail?.github}
            iconSrc="/logos/github.svg"
            iconAlt="GitHub"
            title="GitHub Profile Link"
            optional
          />
          <ProfileInfo
            text={data.userDetail?.linkedIn}
            iconSrc="/logos/in-logo/LI-In-Bug.png"
            iconAlt="LinkedIn"
            title="LinkedIn Profile Link"
            optional
          />
          <ProfileInfo
            text={data.userDetail?.twitter}
            iconSrc="/logos/x.svg"
            iconAlt="X (Twitter)"
            title="X (Twitter) Profile Link"
            optional
          />
          <ProfileInfo
            text={data.userDetail?.bluesky}
            iconSrc="/logos/bluesky.svg"
            iconAlt="Bluesky"
            title="Bluesky Profile Link"
            optional
          />
        </div>
      {:else}
        <p class="muted">No profile details yet.</p>
      {/if}
      <Button kind="secondary" onclick={() => (edit = true)}>Edit Settings</Button>
    {/if}
  </section>

  <!-- TODO Achievements: quizzes completed, days of participation, rank -->
  <!-- TODO More stats: time map; rank, question difficulty and speed over time -->

  <section id="danger-section" class="panel danger">
    <h2>Danger Zone</h2>
    {#if confirmDeleteAccount}
      <form class="delete-form" action="?/deleteAccount" method="POST" use:enhance>
        <p>
          Are you sure you want to delete your account? Your data can't be recovered if you delete
          your account.
        </p>
        {#if form?.deleteAccountUnauthorized}<ErrorMessage errorMessage={form.message} />{/if}
        {#if form?.deleteAccountIncorrectEmail}<ErrorMessage errorMessage={form.message} />{/if}
        <div class="form-field">
          <label for="confirmDeleteAccount"
            >Type your email address, {userAuthenticated.email}, to confirm</label
          >
          <input
            class="form-input"
            type="text"
            id="confirmDeleteAccount"
            name="email"
            autocomplete="off"
            required
          />
        </div>
        <div class="form-actions">
          <Button type="reset" kind="secondary" onclick={() => (confirmDeleteAccount = false)}
            >Cancel</Button
          >
          <Button type="submit" kind="warning">Confirm Delete Account</Button>
        </div>
      </form>
    {:else}
      <p class="muted">Deleting your account removes your rating and quiz history for good.</p>
      <Button type="button" kind="warning" onclick={() => (confirmDeleteAccount = true)}
        >Delete Account</Button
      >
    {/if}
  </section>
</PageContent>

<style>
  .panel {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
    margin-bottom: var(--space-xl);
    padding: var(--space-lg);
    border: 1px solid var(--color-border-card);
    border-radius: var(--radius-card);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-sm);
  }

  h2 {
    margin: 0;
    font-size: var(--text-xl);
  }

  .muted {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
  }

  .details {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(16rem, 100%), 1fr));
    gap: var(--space-xs) var(--space-lg);
    width: 100%;
  }

  .details-form {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(16rem, 100%), 1fr));
    gap: var(--space-md);
    width: 100%;
  }

  .form-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    grid-column: 1 / -1;
  }

  .danger {
    border-color: var(--color-error);
  }

  .danger h2 {
    color: var(--color-error-text);
  }

  .delete-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    width: 100%;
    max-width: 36rem;
  }

  .delete-form p {
    margin: 0;
    color: var(--color-text);
  }
</style>
