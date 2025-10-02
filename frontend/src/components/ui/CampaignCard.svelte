<script lang="ts">
  import type { Campaign } from "@/types/types";
  import { Heart, Building2, Package, Edit } from "lucide-svelte";

  interface Props {
    campaign: Campaign;
    onEdit: (campaign: Campaign) => void;
    onToggle: (campaignId: string, isActive: boolean) => void;
    onSelect: (campaign: Campaign) => void;
  }

  let { campaign, onEdit, onToggle, onSelect }: Props = $props();

  function getTypeIcon(type: string) {
    switch (type) {
      case "donation":
        return Heart;
      case "business":
        return Building2;
      case "product":
        return Package;
      default:
        return Package;
    }
  }

  function handleEdit(e: Event) {
    e.stopPropagation();
    onEdit(campaign);
  }

  function handleView(e: Event) {
    e.stopPropagation();
    onSelect(campaign);
  }
</script>

<div 
  class="group rounded-3xl border border-white/20 bg-white/80 p-6 shadow-lg shadow-purple-500/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer h-[380px] flex flex-col"
  onclick={() => onSelect(campaign)}
  onkeydown={(e) => e.key === 'Enter' && onSelect(campaign)}
  role="button"
  tabindex="0"
>
  <!-- Campaign Header - altura fija -->
  <div class="mb-4 flex items-start gap-4 h-20 flex-shrink-0">
    <div class="relative flex-shrink-0">
      {#if campaign.image}
        <img 
          class="h-16 w-16 rounded-2xl border-2 border-purple-100 shadow-md object-cover" 
          src={campaign.image} 
          alt={campaign.title}
        />
      {:else}
        <div class="h-16 w-16 rounded-2xl border-2 border-purple-100 shadow-md bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
          <svelte:component this={getTypeIcon(campaign.type)} class="w-8 h-8 text-purple-600" />
        </div>
      {/if}
    </div>

    <div class="min-w-0 flex-1 h-full flex flex-col justify-start">
      <!-- Título con altura máxima controlada -->
      <h3 class="text-gray-900 font-bold text-base leading-tight mb-1 line-clamp-2 overflow-hidden">
        {campaign.title}
      </h3>
      <!-- Descripción con altura controlada -->
      <p class="text-gray-500/90 text-xs leading-tight line-clamp-2 overflow-hidden">
        {campaign.description || 'No description available'}
      </p>
    </div>

    <!-- Botón de editar -->
    <button
      onclick={handleEdit}
      class="p-2 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 flex-shrink-0"
      title="Edit campaign"
    >
      <Edit class="w-4 h-4" />
    </button>
  </div>

  <!-- Status Badges - altura fija -->
  <div class="mb-4 flex items-center gap-2 h-6 flex-shrink-0">
    {#if campaign.isActive}
      <span class="rounded-md border border-green-500/20 bg-green-500/20 px-2 py-1 text-xs font-semibold text-green-600 leading-none">Active</span>
    {:else}
      <span class="rounded-md border border-gray-500/20 bg-gray-500/10 px-2 py-1 text-xs font-semibold text-gray-600 leading-none">Inactive</span>
    {/if}
    <span class="rounded-md border border-purple-500/20 bg-purple-500/20 px-2 py-1 text-xs font-semibold text-purple-600 capitalize leading-none">{campaign.type}</span>
  </div>

  <!-- Amount Raised - altura fija -->
  <div class="mb-4 flex items-baseline gap-2 h-12 flex-shrink-0">
    <span class="bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent leading-none">
      {campaign.totalRaised.toFixed(2)}
    </span>
    <span class="text-gray-500/90 text-sm font-medium">APT</span>
  </div>

  <!-- Progress Bar - flex-grow para ocupar el espacio restante -->
  <div class="flex-grow flex flex-col justify-between">
    {#if campaign.goal}
      <div class="space-y-2">
        <div class="h-2 overflow-hidden rounded-full bg-purple-100">
          <div 
            class="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500"
            style="width: {Math.min((campaign.totalRaised / campaign.goal) * 100, 100)}%"
          ></div>
        </div>

        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-500/90 truncate">
            {campaign.donorCount} {campaign.donorCount === 1 ? 'supporter' : 'supporters'}
          </span>
          <span class="font-medium text-purple-600 flex-shrink-0 ml-2">
            {((campaign.totalRaised / campaign.goal) * 100).toFixed(0)}% of {campaign.goal.toFixed(2)} APT
          </span>
        </div>
      </div>
    {:else}
      <div class="text-xs text-gray-500/90">
        {campaign.donorCount} {campaign.donorCount === 1 ? 'supporter' : 'supporters'}
      </div>
    {/if}

    <!-- Footer - siempre al final -->
    <div class="mt-auto pt-4 border-t border-purple-100 flex-shrink-0">
      <div class="flex items-center justify-between">
        <div class="text-xs min-w-0 flex-1">
          <p class="font-mono text-gray-500/90 truncate mb-1">
            by: {campaign.createdBy.slice(0, 6)}...{campaign.createdBy.slice(-4)}
          </p>
          <p class="text-gray-500/90 truncate">
            {campaign.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        </div>

        <a 
          href={`/c/${campaign.createdBy}/${campaign.id}`}
          class="cursor-pointer rounded-md border border-purple-500/20 bg-purple-500/20 px-4 py-2 text-xs font-semibold text-purple-600 hover:bg-purple-500/30 transition-all flex-shrink-0 ml-3"
          onclick={handleView}
        >
          View
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
