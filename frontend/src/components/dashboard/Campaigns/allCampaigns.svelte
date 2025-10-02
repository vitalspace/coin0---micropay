<script lang="ts">
  import { onMount } from "svelte";
  import type { Campaign } from "@/types/types";
  import { useWallet } from "@/hooks/useWallet";
  import CampaignList from "@/components/ui/CampaignCard.svelte";
  import { getUserCampaigns } from "@/services/api.services";
  const { address } = useWallet();

  let campaigns: Campaign[] = [];
  let loading = true;
  let error: string | null = null;

  const typeMap = ["donation", "business", "product"] as const;
  const OCTAS_TO_APT = 100000000; // 10^8 - conversion factor from Octas to APT

  async function loadCampaigns() {
    if (!$address) return;

    try {
      loading = true;
      error = null;

      const response = await getUserCampaigns($address);
      const dbCampaigns = response.data.campaigns;

      console.log("Fetched campaigns from DB:", dbCampaigns);

      campaigns = dbCampaigns.map((dbCampaign: any) => {
        const campaignIdNum = Number(dbCampaign.contractId);

        const campaign: Campaign = {
          id: campaignIdNum.toString(),
          type: dbCampaign.type,
          title: dbCampaign.name,
          description: dbCampaign.description,
          goal: dbCampaign.goal > 0 ? dbCampaign.goal : undefined,
          price: dbCampaign.price > 0 ? dbCampaign.price : undefined,
          image: dbCampaign.image || undefined,
          paymentLink: `https://app.example.com/pay/${dbCampaign.createdBy?.address || ""}/${campaignIdNum}`,
          balance: dbCampaign.totalRaised, // Use totalRaised as balance approximation
          totalRaised: dbCampaign.totalRaised,
          supporterCount: dbCampaign.supporterCount,
          isActive: dbCampaign.isActive,
          createdBy: dbCampaign.createdBy?.address || "",
          createdAt: new Date(dbCampaign.createdAt),
          updatedAt: new Date(dbCampaign.updatedAt),
        };

        return campaign;
      });
    } catch (err) {
      console.error("Error loading campaigns:", err);
      error = "Failed to load campaigns";
    } finally {
      loading = false;
    }
  }

  function handleEdit(campaign: Campaign) {
    // TODO: Implement edit functionality
    console.log("Edit campaign:", campaign);
  }

  function handleToggle(campaignId: string, isActive: boolean) {
    // TODO: Implement toggle functionality
    console.log("Toggle campaign:", campaignId, isActive);
  }

  function handleSelect(campaign: Campaign) {
    // TODO: Implement select functionality
    console.log("Select campaign:", campaign);
  }

  onMount(() => {
    loadCampaigns();
  });

  $: if ($address) {
    loadCampaigns();
  }
</script>

<div class="">
  {#if loading}
    <div class="text-center py-12">
      <div class="text-4xl mb-4">⏳</div>
      <p class="text-gray-400">Loading campaigns...</p>
    </div>
  {:else if error}
    <div class="text-center py-12">
      <div class="text-4xl mb-4">❌</div>
      <p class="text-red-400">{error}</p>
      <button
        onclick={loadCampaigns}
        class="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
      >
        Retry
      </button>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each campaigns as campaign}
        <!-- <div class="bg-gray-800 rounded-lg p-4 mb-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-xl font-semibold text-white">{campaign.title}</h3>
            <button
              class="px-3 py-1 rounded-full text-sm font-medium {campaign.isActive
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'}"
            >
              {campaign.isActive ? "Active" : "Inactive"}
            </button>
          </div>
        </div> -->
        <CampaignList
          {campaign}
          onEdit={handleEdit}
          onToggle={handleToggle}
          onSelect={handleSelect}
        />
      {/each}
    </div>
    <!-- <CampaignList
      {campaigns}
      onEdit={handleEdit}
      onToggle={handleToggle}
      onSelect={handleSelect}
    /> -->
  {/if}

  {#if campaigns.length === 0}
    <div class="text-center py-12">
      <div class="text-6xl mb-4">📄</div>
      <h3 class="text-xl font-semibold text-white mb-2">No campaigns yet</h3>
      <p class="text-gray-400">
        Create your first campaign to start receiving payments
      </p>
    </div>
  {/if}
</div>
