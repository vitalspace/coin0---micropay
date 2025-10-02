<script lang="ts">
  import { onMount } from "svelte";
  import { User, MapPin, Calendar, Link as LinkIcon } from "lucide-svelte";
  import { useWallet } from "@/hooks/useWallet";
  import { useContract } from "@/hooks/useContract";
  import { activeTab } from "@/stores/stores";
  import { showToast } from "@/stores/toastStore";
  import type { Campaign } from "@/types/types";

  const { userStore, address } = useWallet();
  const { getAllCampaigns, getCampaignBalance, getDonationHistory, getPurchaseHistory } = useContract();
  const userProfile = $derived($userStore);

  let campaigns: Campaign[] = $state([]);
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

  onMount(() => {
    loadCampaigns();
  });

  $effect(() => {
    if ($address) loadCampaigns();
  });

  async function shareProfile(address: string) {
    const url = `${window.location.origin}/u/${address}`;

    try {
      await navigator.clipboard.writeText(url);
      showToast('Profile link copied to clipboard!', 'success');
    } catch (error) {
      showToast('Failed to copy link', 'error');
    }
  }
</script>

<div class="bg-gradient-to-br from-slate-50 via-white to-gray-50 rounded-3xl p-8 border border-gray-200/50 shadow-lg relative overflow-hidden">
  <!-- Efectos de fondo sutiles -->
  <div class="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-100/30 to-cyan-100/20 rounded-full blur-2xl"></div>
  <div class="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-emerald-100/20 to-teal-100/15 rounded-full blur-3xl"></div>

  <div class="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
    <!-- Avatar Section Mejorada -->
    <div class="flex-shrink-0">
      <div class="relative">
        <div class="bg-white/80 backdrop-blur-sm p-4 rounded-3xl shadow-xl border border-white/50 group hover:shadow-2xl transition-all duration-300">
          {#if userProfile.avatar}
            <img 
              src={userProfile.avatar} 
              alt="Avatar" 
              class="h-24 w-24 rounded-2xl object-cover ring-4 ring-white/50" 
            />
          {:else}
            <div class="bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 p-4 rounded-2xl shadow-lg">
              <User class="h-16 w-16 text-white drop-shadow-sm" />
            </div>
          {/if}
        </div>
        <!-- Indicador online -->
        <div class="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white shadow-lg">
          <div class="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
        </div>
      </div>
    </div>

    <!-- Profile Info Mejorada -->
    <div class="flex-1 text-center md:text-left space-y-6">
      <!-- Información principal -->
      <div class="space-y-3">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          {userProfile.nickname || 'Anonymous User'}
        </h2>
        
        {#if userProfile.bio}
          <p class="text-gray-700 text-base leading-relaxed max-w-2xl">
            {userProfile.bio}
          </p>
        {:else}
          <p class="text-gray-500 text-base italic">
            No bio available yet. Add a description to tell others about yourself.
          </p>
        {/if}

        <!-- Información adicional -->
        <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
          {#if userProfile.address}
            <div class="flex items-center gap-2 bg-gray-100/80 backdrop-blur-sm px-3 py-2 rounded-xl">
              <LinkIcon class="h-4 w-4 text-gray-500" />
              <span class="font-mono text-xs">
                {userProfile.address.slice(0, 8)}...{userProfile.address.slice(-6)}
              </span>
            </div>
          {/if}

          <div class="flex items-center gap-2 bg-green-100/80 backdrop-blur-sm px-3 py-2 rounded-xl">
            <Calendar class="h-4 w-4 text-green-600" />
            <span class="text-green-700 font-medium">Member since 2025</span>
          </div>
        </div>
      </div>

      <!-- Stats Grid Mejoradas -->
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group">
          <div class="text-3xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
            {campaigns.length}
          </div>
          <div class="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Campaigns
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group">
          <div class="text-3xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
            {campaigns.reduce((sum, c) => sum + c.donorCount, 0)}
          </div>
          <div class="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Supporters
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group">
          <div class="text-3xl font-bold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors">
            {campaigns.reduce((sum, c) => sum + c.totalRaised, 0).toFixed(2)}
          </div>
          <div class="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            APT Raised
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-4">
        <button onclick={() => activeTab.set(3)} class="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          Edit Profile
        </button>

        <button onclick={() => shareProfile(userProfile.address)} class="px-6 py-3 bg-white/80 backdrop-blur-sm text-gray-700 hover:text-gray-900 rounded-2xl font-semibold border border-gray-200/60 hover:border-gray-300/60 shadow-md hover:shadow-lg transition-all duration-300">
          Share Profile
        </button>
      </div>
    </div>
  </div>
</div>
