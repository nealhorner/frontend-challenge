<script lang="ts">
  import ProfileStatKpi from './ProfileStatKPI.svelte';

  interface Props {
    completedQuizzes: number;
    accuracy: number;
    rank: number;
  }

  let { completedQuizzes = 0, accuracy = 0, rank = 0 }: Props = $props();

  function formatPercentage(value: number) {
    return `${Math.round(value * 100)}%`;
  }
  function formatNumber(value: number) {
    return value.toLocaleString();
  }

  function OrdinalNumberSuffix(value: number) {
    const mod100 = value % 100;
    if (mod100 >= 11 && mod100 <= 13) return 'th';
    switch (value % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  function formatRating(value: number) {
    if (!value || value === 0 || value > 1000000) return '>1,000,000th';
    return `${formatNumber(value)}${OrdinalNumberSuffix(value)}`;
  }
</script>

<section>
  <h2>Stats</h2>
  <div class="kpis">
    <ProfileStatKpi kpi="Quizzes Completed" value={formatNumber(completedQuizzes)} />
    <ProfileStatKpi kpi="Accuracy" value={formatPercentage(accuracy)} />
    <ProfileStatKpi kpi="Rank" value={formatRating(rank)} />
  </div>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    border: 1px solid rgb(249, 158, 0);
    padding: 20px;
  }

  .kpis {
    display: flex;
    gap: 20px;
  }
</style>
