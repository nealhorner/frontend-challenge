<script lang="ts">
  import type { Icon as IconType } from 'lucide-svelte';

  interface Props {
    text?: string | null;
    icon?: typeof IconType;
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
  .profile-info {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-xs) 0;
    color: var(--color-text);
    font-size: var(--text-sm);
    overflow-wrap: anywhere;
  }

  .profile-info-icon-container {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: var(--radius-button);
    background-color: var(--color-surface-sunken);
    color: var(--color-text-secondary);
  }
</style>
