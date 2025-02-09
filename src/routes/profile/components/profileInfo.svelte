<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  interface Props {
    text: any;
    faIcon: any;
    title: any;
    optional?: boolean;
  }

  let { text, faIcon, title, optional = false }: Props = $props();

  let display = !!text || !optional;
</script>

{#if display}
  <div class="profile-info" {title}>
    <div class="profile-info-icon-container">
      <FontAwesomeIcon icon={faIcon} class="profile-info-icon" />
    </div>
    {#if text}
      <span>{text}</span>
    {/if}
  </div>
{/if}

<style>
  .profile-info-icon-container {
    margin-right: 0.5rem;
    width: 16px;
    background-color: aqua;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
