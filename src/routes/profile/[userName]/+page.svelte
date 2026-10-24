<script lang="ts">
  import PageContent from '$lib/components/PageContent.svelte';
  import PageHeader from '$lib/components/PageHeader.svelte';

  interface Props {
    userName?: string;
    dateJoined?: string;
    rank?: string;
    completedQuizzes?: string;
  }

  let { userName = '', dateJoined = '', rank = '', completedQuizzes = '' }: Props = $props();
</script>

<PageContent width="medium">
  <PageHeader eyebrow="Community" title="Public Profile" />

  <dl class="facts">
    <div>
      <dt>Username</dt>
      <dd>{userName || '—'}</dd>
    </div>
    <div>
      <dt>Date Joined</dt>
      <dd>{dateJoined || '—'}</dd>
    </div>
    <div>
      <dt>Rank</dt>
      <dd>{rank || '—'}</dd>
    </div>
    <div>
      <dt>Completed Quizzes</dt>
      <dd>{completedQuizzes || '—'}</dd>
    </div>
  </dl>
</PageContent>

<style>
  .facts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(12rem, 100%), 1fr));
    gap: var(--space-md);
    margin: 0;
  }

  .facts div {
    padding: var(--space-md) var(--space-lg);
    border: 1px solid var(--color-border-card);
    border-radius: var(--radius-card);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-sm);
  }

  dt {
    color: var(--color-text-secondary);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  dd {
    margin: var(--space-xs) 0 0;
    color: var(--color-text);
    font-size: var(--text-xl);
    font-weight: 600;
    overflow-wrap: anywhere;
  }
</style>
