<script lang="ts">
  import { onMount } from "svelte";
  import Card from "@/components/ui/Card_1.svelte";
  import { Users, Activity, DollarSign } from "lucide-svelte";
  import Withdraw from "./Withdraw.svelte";
  import { useWallet } from "@/hooks/useWallet";
  import { useContract } from "@/hooks/useContract";
  import { activeTab } from "@/stores/stores";
  import type { Campaign } from "@/types/types";
  import { getUserCampaigns } from "@/services/api.services";

  const { address } = useWallet();
  const { getActiveCampaigns, getTotalBalance } = useContract();

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
      const response = await getUserCampaigns(userAddress);
      const dbCampaigns = response.data.campaigns;

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
      description="You have {campaigns.reduce((sum, c) => sum + c.supporterCount, 0)} supporters who have contributed to your campaigns."
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
