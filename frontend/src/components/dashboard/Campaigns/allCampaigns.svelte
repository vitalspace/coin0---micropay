<script lang="ts">
  import { onMount } from "svelte";
  import type { Campaign } from "@/types/types";
  import { useContract } from "@/hooks/useContract";
  import { useWallet } from "@/hooks/useWallet";
  import CampaignList from "@/components/ui/CampaignCard.svelte";

  const {
    getAllCampaigns,
    getCampaignBalance,
    getDonationHistory,
    getPurchaseHistory,
  } = useContract();
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

      const allCampaigns = await getAllCampaigns($address);

      console.log("Fetched campaigns:", allCampaigns);

      const campaignPromises = allCampaigns.map(async (campaignData) => {
        const {
          id,
          campaign_type,
          name,
          description,
          goal,
          price,
          image,
          is_active,
          created_by,
          created_at,
          updated_at,
        } = campaignData;

        // Convert values to numbers
        const goalNum = Number(goal);
        const priceNum = Number(price);
        const campaignIdNum = Number(id);

        const balance = await getCampaignBalance($address, campaignIdNum);
        const donations = await getDonationHistory($address, campaignIdNum);
        const purchases = await getPurchaseHistory($address, campaignIdNum);

        const totalRaised =
          donations.reduce(
            (sum, d) =>
              sum +
              (typeof d.amount === "string"
                ? parseInt(d.amount)
                : Number(d.amount)),
            0
          ) +
          purchases.reduce(
            (sum, p) =>
              sum +
              (typeof p.total_amount === "string"
                ? parseInt(p.total_amount)
                : Number(p.total_amount)),
            0
          );

        const donorCount = new Set([
          ...donations.map((d) => d.donor),
          ...purchases.map((p) => p.buyer),
        ]).size;

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
