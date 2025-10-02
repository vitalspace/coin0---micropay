<script lang="ts">
  import { onMount } from "svelte";
  import { User } from "lucide-svelte";
  import CampaignCard from "../components/ui/CampaignCard.svelte";
  import { useWallet } from "../hooks/useWallet";
  import { useContract } from "../hooks/useContract";
  import type { Campaign } from "../types/types";

  const { userStore, address } = useWallet();
  const { getAllCampaigns, getCampaignBalance, getDonationHistory, getPurchaseHistory } = useContract();

  let campaigns: Campaign[] = [];
  let loading = true;

  const typeMap = ["donation", "business", "product"] as const;
  const OCTAS_TO_APT = 100000000;

  async function loadCampaigns() {
    if (!$address) return;

    try {
      const allCampaignsData = await getAllCampaigns($address);

      const campaignPromises = allCampaignsData.map(async (campaignData) => {
        const { id, campaign_type, name, description, goal, price, image, is_active, created_by, created_at, updated_at } = campaignData;

        const goalNum = Number(goal);
        const priceNum = Number(price);
        const campaignIdNum = Number(id);

        const balance = await getCampaignBalance($address, campaignIdNum);
        const donations = await getDonationHistory($address, campaignIdNum);
        const purchases = await getPurchaseHistory($address, campaignIdNum);

        const totalRaised = donations.reduce((sum, d) => sum + Number(d.amount), 0) + purchases.reduce((sum, p) => sum + Number(p.total_amount), 0);

        const donorCount = new Set([...donations.map(d => d.donor), ...purchases.map(p => p.buyer)]).size;

        const campaign: Campaign = {
          id: campaignIdNum.toString(),
          type: typeMap[campaign_type] || "donation",
          title: name,
          description,
          goal: goalNum > 0 ? goalNum / OCTAS_TO_APT : undefined,
          price: priceNum > 0 ? priceNum / OCTAS_TO_APT : undefined,
          image: image || undefined,
          paymentLink: `https://app.example.com/pay/${$address}/${campaignIdNum}`,
          balance: Number(balance) / OCTAS_TO_APT,
          totalRaised: totalRaised / OCTAS_TO_APT,
          donorCount,
          isActive: is_active,
          createdBy: created_by,
          createdAt: new Date(created_at),
          updatedAt: new Date(updated_at),
        };

        return campaign;
      });

      campaigns = await Promise.all(campaignPromises);
    } catch (err) {
      console.error(err);
    } finally {
      loading = false;
    }
  }

  function handleEdit(campaign: Campaign) {
    // Do nothing for public profile
  }

  function handleToggle(campaignId: string, isActive: boolean) {
    // Do nothing for public profile
  }

  function handleSelect(campaign: Campaign) {
    // Navigate to campaign page
    window.location.href = `/c/${campaign.createdBy}/${campaign.id}`;
  }

  onMount(() => {
    loadCampaigns();
  });

  $: if ($address) loadCampaigns();
</script>

<!-- Fondo con gradiente púrpura y efectos -->
<div class="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 relative overflow-hidden">
  <!-- Efectos de fondo animados -->
  <div class="fixed inset-0 overflow-hidden pointer-events-none">
    <!-- Blob púrpura superior izquierdo -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
    
    <!-- Blob índigo inferior derecho -->
    <div class="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-300/30 rounded-full blur-3xl animate-pulse" style="animation-delay: 1.5s;"></div>
    
    <!-- Blob rosa central -->
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 3s;"></div>
    
    <!-- Gradiente sutil superior -->
    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
  </div>

  <div class="container relative z-10 mx-auto px-4 pt-28 pb-10 max-w-7xl">
    <!-- Profile Header Card -->
    <div class="mb-12 rounded-3xl border border-white/20 bg-white/80 p-8 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
      <div class="flex flex-col items-start gap-8 md:flex-row md:items-center">
        <!-- Avatar -->
        <div class="relative">
          <div class="h-28 w-28 rounded-full border-4 border-purple-100 shadow-xl dark:border-purple-900/70 overflow-hidden">
            {#if $userStore.avatar}
              <img src={$userStore.avatar} alt="Avatar" class="h-full w-full object-cover" />
            {:else}
              <div class="h-full w-full bg-gradient-to-br from-purple-200 to-indigo-200 flex items-center justify-center">
                <User class="h-14 w-14 text-purple-600" />
              </div>
            {/if}
          </div>
        </div>

        <!-- Profile Info -->
        <div class="flex-1 space-y-3">
          <h2 class="text-foreground text-4xl font-bold">
            {$userStore.nickname || 'Anonymous User'}
          </h2>
          {#if $userStore.bio}
            <p class="text-muted-foreground text-base text-gray-500">{$userStore.bio}</p>
          {:else}
            <p class="text-muted-foreground text-base text-gray-500">Web3 Creator & Campaign Manager</p>
          {/if}
          {#if $userStore.address}
            <span class="inline-block rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-500 font-mono">
              {$userStore.address.slice(0, 10)}...{$userStore.address.slice(-8)}
            </span>
          {/if}
        </div>

        <!-- Stats -->
        <div class="flex w-full flex-wrap gap-4 md:w-auto">
          <div class="rounded-md p-4 text-center shadow-lg shadow-purple-500/10">
            <p class="mb-2 bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent">
              {campaigns.length}
            </p>
            <span class="text-muted-foreground text-xs font-medium tracking-wider text-gray-500 uppercase">Campaigns</span>
          </div>

          <div class="rounded-md p-4 text-center shadow-lg shadow-purple-500/10">
            <p class="mb-2 bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent">
              {campaigns.reduce((sum, c) => sum + c.donorCount, 0)}
            </p>
            <span class="text-muted-foreground text-xs font-medium tracking-wider text-gray-500 uppercase">Supporters</span>
          </div>

          <div class="rounded-md p-4 text-center shadow-lg shadow-purple-500/10">
            <p class="mb-2 bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent">
              {campaigns.reduce((sum, c) => sum + c.totalRaised, 0).toFixed(2)}
            </p>
            <span class="text-muted-foreground text-xs font-medium tracking-wider text-gray-500 uppercase">APT Raised</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Campaigns Section Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-foreground mb-1 text-2xl font-bold">Active Campaigns</h2>
        <p class="text-muted-foreground text-sm">Discover and support amazing projects</p>
      </div>
      {#if campaigns.length > 0}
        <div class="flex items-center space-x-2">
          <div class="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
          <span class="text-muted-foreground text-sm font-medium">{campaigns.filter(c => c.isActive).length} active</span>
        </div>
      {/if}
    </div>

    {#if loading}
      <!-- Loading State -->
      <div class="text-center py-16">
        <div class="relative inline-block">
          <div class="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
        <h3 class="text-xl font-semibold text-gray-700 mt-6 mb-2">Loading campaigns...</h3>
        <p class="text-gray-500">Please wait while we fetch the latest data</p>
      </div>
    {:else if campaigns.length === 0}
      <!-- Empty State -->
      <div class="text-center py-16">
        <div class="relative mb-8">
          <div class="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto">
            <div class="text-4xl">🚀</div>
          </div>
          <div class="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <span class="text-xs">✨</span>
          </div>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">Ready to start something amazing?</h3>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">This user hasn't created any campaigns yet. Be the first to support their future projects!</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            Follow User
          </button>
          <button class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200">
            Share Profile
          </button>
        </div>
      </div>
    {:else}
      <!-- Campaigns Grid -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each campaigns as campaign}
          <div 
            class="group rounded-3xl border border-white/20 bg-white/80 p-6 shadow-lg shadow-purple-500/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
            on:click={() => handleSelect(campaign)}
            on:keydown={(e) => e.key === 'Enter' && handleSelect(campaign)}
            role="button"
            tabindex="0"
          >
            <!-- Campaign Header -->
            <div class="mb-6 flex items-start gap-4">
              <div class="relative">
                {#if campaign.image}
                  <img 
                    class="h-16 w-16 rounded-2xl border-2 border-purple-100 shadow-md dark:border-purple-900/30 object-cover" 
                    src={campaign.image} 
                    alt={campaign.title}
                  />
                {:else}
                  <div class="h-16 w-16 rounded-2xl border-2 border-purple-100 shadow-md dark:border-purple-900/30 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                    <span class="text-2xl">🎯</span>
                  </div>
                {/if}
              </div>

              <div class="min-w-0 flex-1">
                <h3 class="text-foreground mb-1 truncate text-lg font-bold text-balance">{campaign.title}</h3>
                <p class="text-muted-foreground truncate text-xs text-gray-500/90">{campaign.description}</p>
              </div>
            </div>

            <!-- Status Badges -->
            <div class="mb-6 flex items-center gap-2">
              {#if campaign.isActive}
                <span class="rounded-md border border-green-500/20 bg-green-500/20 px-2 py-1 text-xs font-semibold text-green-600">Active</span>
              {:else}
                <span class="rounded-md border border-gray-500/20 bg-gray-500/10 px-2 py-1 text-xs font-semibold text-gray-600">Inactive</span>
              {/if}
              <span class="rounded-md border border-purple-500/20 bg-purple-500/20 px-2 py-1 text-xs font-semibold text-purple-600 capitalize">{campaign.type}</span>
            </div>

            <!-- Amount Raised -->
            <div class="mb-4 flex items-baseline gap-2">
              <span class="bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent">
                {campaign.totalRaised.toFixed(2)}
              </span>
              <span class="text-muted-foreground text-sm font-medium text-gray-500/90">APT</span>
            </div>

            <!-- Progress Bar -->
            {#if campaign.goal}
              <div class="space-y-2">
                <div class="h-2 overflow-hidden rounded-full bg-purple-100 dark:bg-purple-900/20">
                  <div 
                    class="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500"
                    style="width: {Math.min((campaign.totalRaised / campaign.goal) * 100, 100)}%"
                  ></div>
                </div>

                <div class="flex items-center justify-between text-xs">
                  <span class="text-muted-foreground text-gray-500/90">
                    {campaign.donorCount} {campaign.donorCount === 1 ? 'supporter' : 'supporters'}
                  </span>
                  <span class="font-medium text-purple-600 dark:text-purple-400">
                    {((campaign.totalRaised / campaign.goal) * 100).toFixed(0)}% of {campaign.goal.toFixed(2)} APT
                  </span>
                </div>
              </div>
            {:else}
              <div class="space-y-2">
                <div class="text-xs text-gray-500/90">
                  {campaign.donorCount} {campaign.donorCount === 1 ? 'supporter' : 'supporters'}
                </div>
              </div>
            {/if}

            <!-- Footer -->
            <div class="mt-6 flex items-center justify-between border-t border-purple-100 pt-6 dark:border-purple-900/30">
              <div class="text-muted-foreground space-y-1 text-xs">
                <p class="font-medium text-gray-500/90 font-mono">
                  
                  by: {campaign.createdBy.slice(0, 6)}...{campaign.createdBy.slice(-4)}
                </p>
                <p class="text-gray-500/90">
                  {campaign.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
              </div>

              <button 
                class="cursor-pointer rounded-md border border-purple-500/20 bg-purple-500/20 px-4 py-2 text-xs font-semibold text-purple-600 hover:bg-purple-500/30 transition-all"
                on:click|stopPropagation={() => handleSelect(campaign)}
              >
                View
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
