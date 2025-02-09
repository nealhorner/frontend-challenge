<script lang="ts">
  interface Props {
    userName?: string;
    dateJoined?: string;
    rank?: string;
    completedQuizzes?: string;
  }

  let { userName = '', dateJoined = '', rank = '', completedQuizzes = '' }: Props = $props();
</script>

<h1>Public Profile</h1>

<p>Username: {userName}</p>
<p>Date Joined: {dateJoined}</p>
<p>Rank: {rank}</p>
<p>Completed Quizzes: {completedQuizzes}</p>
