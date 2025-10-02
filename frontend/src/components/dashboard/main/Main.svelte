<script lang="ts">
  import { onMount } from "svelte";
  import Card from "@/components/ui/Card_1.svelte";
  import { Users, Activity, DollarSign } from "lucide-svelte";
  import Withdraw from "./Withdraw.svelte";
  import { useWallet } from "@/hooks/useWallet";
  import { useContract } from "@/hooks/useContract";
  import { activeTab } from "@/stores/stores";
  import type { Campaign } from "@/types/types";

  const { address } = useWallet();
  const { getAllCampaigns, getCampaignBalance, getDonationHistory, getPurchaseHistory, getActiveCampaigns, getTotalBalance } = useContract();

  let campaigns: Campaign[] = $state([]);
  let activeCampaigns: number[] = $state([]);
  let totalBalance = $state(0n);
  let loading = $state(true);

  const userAddress = $derived($address);

  const typeMap = ["donation", "business", "product"] as const;
  const OCTAS_TO_APT = 100000000;

  const loadCampaigns = async () => {
    if (!userAddress) return;

    try {
      const allCampaignsData = await getAllCampaigns(userAddress);

      const campaignPromises = allCampaignsData.map(async (campaignData) => {
        const { id, campaign_type, name, description, goal, price, image, is_active, created_by, created_at, updated_at } = campaignData;

        const goalNum = Number(goal);
        const priceNum = Number(price);
        const campaignIdNum = Number(id);

        const balance = await getCampaignBalance(userAddress, campaignIdNum);
        const donations = await getDonationHistory(userAddress, campaignIdNum);
        const purchases = await getPurchaseHistory(userAddress, campaignIdNum);

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
          paymentLink: `https://app.example.com/pay/${userAddress}/${campaignIdNum}`,
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
  };

  const init = async () => {
    if (!userAddress) return;
    try {
      await loadCampaigns();
      activeCampaigns = await getActiveCampaigns(userAddress);
      const balance = await getTotalBalance(userAddress);
      totalBalance = BigInt(balance);
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  };

  onMount(() => {
    init();
  });

  $effect(() => {
    if (userAddress) init();
  });
</script>

<div class="grid gap-8">
  <Withdraw />
  <div class="grid grid-11cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <Card
      icon={Users}
      title="Total Supporters"
      description="You have {campaigns.reduce((sum, c) => sum + c.donorCount, 0)} supporters who have contributed to your campaigns."
      action=""
    />

    <Card
      icon={Activity}
      title="Active Campaigns"
      description="You have {activeCampaigns.length} active campaigns running."
      action="View All"
      onAction={() => activeTab.set(1)}
    />

    <Card
      icon={DollarSign}
      title="Total Balance"
      description="Your total balance across all campaigns is {(Number(totalBalance) / 100000000).toFixed(2)} APT."
      action=""
    />
  </div>
</div>
