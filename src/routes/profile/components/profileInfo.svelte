<script lang="ts">
  import type { Component } from 'svelte';

  interface Props {
    text?: string | null;
    icon?: Component;
    iconSrc?: string;
    iconAlt?: string;
    title: string;
    optional?: boolean;
  }

  let { text, icon: Icon, iconSrc, iconAlt = '', title, optional = false }: Props = $props();

  let display = $derived(!!text || !optional);
</script>

{#if display}
  <div class="profile-info" {title}>
    <div class="profile-info-icon-container">
      {#if Icon}
        <Icon size={16} class="profile-info-icon" />
      {:else if iconSrc}
        <img src={iconSrc} alt={iconAlt} class="profile-info-icon" width="16" height="16" />
      {/if}
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
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
