<script lang="ts">
  import DonorChart from "@/components/ui/DonorChart.svelte";
  import IncomeChart from "@/components/ui/IncomeChart.svelte";
  import { useContract } from "@/hooks/useContract";
  import { useWallet } from "@/hooks/useWallet";
  import { generateAIAnalysis } from "@/services/api.services";
  import type { AnalyticsData, Campaign } from "@/types/types";
  import { Brain, DollarSign, TrendingUp, Users } from "lucide-svelte";
  import { onMount } from "svelte";

  const { address } = useWallet();
  const useContractInstance = useContract();
  const { getAllSupporters } = useContractInstance;

  let campaigns: Campaign[] = [];
  let analyticsData: AnalyticsData | null = null;
  let loading = true;
  let error: string | null = null;
  let aiAnalysis = "";
  let showAIAnalysis = false;
  let aiLoading = false;
  let realTotalSupporters = 0;

  async function loadAnalytics() {
    if (!$address) {
      loading = false;
      return;
    }

    try {
      loading = true;
      error = null;

      console.log("Loading analytics for address:", $address);

      // Get campaigns from contract
      const contractCampaigns =
        await useContractInstance.getAllCampaigns($address);

      // Process campaigns
      campaigns = contractCampaigns.map((contractCampaign: any) => ({
        id: contractCampaign.id.toString(),
        type:
          contractCampaign.campaign_type === 0
            ? "donation"
            : contractCampaign.campaign_type === 1
              ? "business"
              : "product",
        title: contractCampaign.name,
        description: contractCampaign.description,
        goal:
          contractCampaign.goal > 0
            ? contractCampaign.goal / 100000000
            : undefined,
        price:
          contractCampaign.price > 0
            ? contractCampaign.price / 100000000
            : undefined,
        image: contractCampaign.image || undefined,
        paymentLink: `https://app.example.com/pay/${$address}/${contractCampaign.id}`,
        balance: 0, // Will be updated from contract
        totalRaised: 0, // Will be updated from contract
        supporterCount: 0, // Will be updated from contract
        donorCount: 0,
        isActive: contractCampaign.is_active,
        createdBy: $address,
        createdAt: new Date(contractCampaign.created_at),
        updatedAt: new Date(contractCampaign.updated_at),
      }));

      // Get real balances and supporter counts from contract
      for (let i = 0; i < campaigns.length; i++) {
        const campaignId = parseInt(campaigns[i].id);
        try {
          // Get campaign details including balance
          const campaignData = await useContractInstance.getCampaign(
            $address,
            campaignId
          );
          const balance = campaignData[1]; // balance is at index 1
          campaigns[i].balance = balance / 100000000; // Convert octas to APT

          // Get supporter count and total raised from donation and purchase histories
          const donations = await useContractInstance.getDonationHistory(
            $address,
            campaignId
          );
          const purchases = await useContractInstance.getPurchaseHistory(
            $address,
            campaignId
          );
          const totalRaised =
            donations.reduce((sum, d) => sum + Number(d.amount), 0) +
            purchases.reduce((sum, p) => sum + Number(p.total_amount), 0);
          campaigns[i].totalRaised = totalRaised / 100000000; // Convert octas to APT

          const uniqueSupporters = new Set([
            ...donations.map((d) => d.donor),
            ...purchases.map((p) => p.buyer),
          ]);
          campaigns[i].supporterCount = uniqueSupporters.size;
          campaigns[i].donorCount = campaigns[i].supporterCount;
        } catch (error) {
          console.error(
            `Error getting data for campaign ${campaignId}:`,
            error
          );
        }
      }

      // Calculate analytics data from contract
      let allDonations: any[] = [];
      let allPurchases: any[] = [];

      for (const campaign of campaigns) {
        const campaignId = parseInt(campaign.id);
        try {
          const donations = await useContractInstance.getDonationHistory(
            $address,
            campaignId
          );
          allDonations.push(...donations);
          const purchases = await useContractInstance.getPurchaseHistory(
            $address,
            campaignId
          );
          allPurchases.push(...purchases);
        } catch (error) {
          console.error(
            `Error getting history for campaign ${campaignId}:`,
            error
          );
        }
      }

      // Aggregate daily income
      const dailyIncomeMap = new Map<string, number>();
      allDonations.forEach((donation) => {
        if (donation.donated_at > 0) {
          const date = new Date(donation.donated_at * 1000)
            .toISOString()
            .split("T")[0];
          const amount = Number(donation.amount) / 100000000; // Convert octas to APT
          dailyIncomeMap.set(date, (dailyIncomeMap.get(date) || 0) + amount);
        }
      });
      allPurchases.forEach((purchase) => {
        if (purchase.purchased_at > 0) {
          const date = new Date(purchase.purchased_at * 1000)
            .toISOString()
            .split("T")[0];
          const amount = Number(purchase.total_amount) / 100000000;
          dailyIncomeMap.set(date, (dailyIncomeMap.get(date) || 0) + amount);
        }
      });

      const dailyIncome = Array.from(dailyIncomeMap.entries())
        .map(([date, amount]) => ({
          date,
          amount: Math.round(amount * 100) / 100,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Aggregate donor ranking
      const donorMap = new Map<
        string,
        { totalAmount: number; paymentCount: number }
      >();
      allDonations.forEach((donation) => {
        const amount = Number(donation.amount) / 100000000;
        const existing = donorMap.get(donation.donor) || {
          totalAmount: 0,
          paymentCount: 0,
        };
        donorMap.set(donation.donor, {
          totalAmount: existing.totalAmount + amount,
          paymentCount: existing.paymentCount + 1,
        });
      });
      allPurchases.forEach((purchase) => {
        const amount = Number(purchase.total_amount) / 100000000;
        const existing = donorMap.get(purchase.buyer) || {
          totalAmount: 0,
          paymentCount: 0,
        };
        donorMap.set(purchase.buyer, {
          totalAmount: existing.totalAmount + amount,
          paymentCount: existing.paymentCount + 1,
        });
      });

      const donorRanking = Array.from(donorMap.entries())
        .map(([address, data]) => ({
          address: address.slice(0, 10) + "...",
          totalAmount: Math.round(data.totalAmount * 100) / 100,
          paymentCount: data.paymentCount,
        }))
        .sort((a, b) => b.totalAmount - a.totalAmount)
        .slice(0, 10);

      // Mock traffic sources (could be implemented with real tracking later)
      const trafficSources = [
        { source: "Direct", visits: Math.floor(Math.random() * 100) + 50 },
        { source: "Twitter", visits: Math.floor(Math.random() * 80) + 20 },
        { source: "Discord", visits: Math.floor(Math.random() * 60) + 10 },
        { source: "Other", visits: Math.floor(Math.random() * 40) + 5 },
      ];

      analyticsData = {
        dailyIncome,
        weeklyIncome: [], // Could calculate weekly from daily
        donorRanking,
        trafficSources,
      };

      realTotalSupporters = campaigns.reduce(
        (sum: number, c: any) => sum + c.supporterCount,
        0
      );

      console.log("Analytics loaded successfully:", {
        campaigns: campaigns.length,
        analyticsData,
        realTotalSupporters,
      });
    } catch (err) {
      console.error("Error loading analytics:", err);
      error = `Failed to load analytics data: ${err}`;
    } finally {
      loading = false;
    }
  }

  async function handleGenerateAIAnalysis() {
    if (!analyticsData || !campaigns.length) return;

    try {
      aiLoading = true;

      // Generate AI analysis
      aiAnalysis = await generateAIAnalysis(campaigns, analyticsData, $address);

      showAIAnalysis = true;
    } catch (err) {
      console.error("Error generating AI analysis:", err);
      aiAnalysis =
        "Unable to generate analysis at this time. Please check your connection and try again.";
      showAIAnalysis = true;
    } finally {
      aiLoading = false;
    }
  }

  onMount(() => {
    loadAnalytics();
  });

  $: if ($address) {
    loadAnalytics();
  }

  // Calculate summary stats
  $: totalRaised = campaigns.reduce((sum, c) => sum + c.totalRaised, 0);
  $: totalBalance = campaigns.reduce((sum, c) => sum + c.balance, 0);
  $: totalSupporters = campaigns.reduce((sum, c) => sum + c.supporterCount, 0);
  $: activeCampaigns = campaigns.filter((c) => c.isActive).length;
  $: avgDonation = totalRaised / Math.max(totalSupporters, 1);
</script>

<div class="space-y-8">
  {#if loading}
    <div class="text-center py-16">
      <div class="relative inline-block">
        <div
          class="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"
        ></div>
      </div>
      <p class="text-cyan-300 mt-6 text-lg font-medium">Loading analytics...</p>
    </div>
  {:else if error}
    <div class="text-center py-16">
      <div
        class="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <div class="text-4xl">❌</div>
      </div>
      <p class="text-red-400 text-lg font-semibold mb-2">{error}</p>
      <button
        onclick={loadAnalytics}
        class="mt-6 px-6 py-3 bg-cyan-600 text-white rounded-xl font-medium hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300"
      >
        Retry
      </button>
    </div>
  {:else}
    <!-- Summary Cards with solid colors -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <!-- Total Raised Card -->
      <div
        class="group relative bg-blue-900/60 backdrop-blur-xl border border-blue-500/40 rounded-2xl p-6 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1"
      >
        <div class="flex items-start justify-between mb-3">
          <div
            class="p-3 bg-blue-700/40 rounded-xl group-hover:bg-blue-600/50 transition-colors duration-300"
          >
            <DollarSign class="w-6 h-6 text-blue-300" />
          </div>
          <div class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
        </div>
        <p
          class="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1"
        >
          Total Raised
        </p>
        <p class="text-3xl font-bold text-white mb-1">
          {campaigns.reduce((sum, c) => sum + c.totalRaised, 0).toFixed(2)}
        </p>
        <p class="text-sm text-blue-300 font-medium">APT</p>
      </div>

      <!-- Available Balance Card -->
      <div
        class="group relative bg-emerald-900/60 backdrop-blur-xl border border-emerald-500/40 rounded-2xl p-6 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1"
      >
        <div class="flex items-start justify-between mb-3">
          <div
            class="p-3 bg-emerald-700/40 rounded-xl group-hover:bg-emerald-600/50 transition-colors duration-300"
          >
            <DollarSign class="w-6 h-6 text-emerald-300" />
          </div>
          <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        </div>
        <p
          class="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1"
        >
          Available Balance
        </p>
        <p class="text-3xl font-bold text-white mb-1">
          {totalBalance.toFixed(2)}
        </p>
        <p class="text-sm text-emerald-300 font-medium">APT</p>
      </div>

      <!-- Total Supporters Card -->
      <div
        class="group relative bg-purple-900/60 backdrop-blur-xl border border-purple-500/40 rounded-2xl p-6 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1"
      >
        <div class="flex items-start justify-between mb-3">
          <div
            class="p-3 bg-purple-700/40 rounded-xl group-hover:bg-purple-600/50 transition-colors duration-300"
          >
            <Users class="w-6 h-6 text-purple-300" />
          </div>
          <div class="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
        </div>
        <p
          class="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1"
        >
          Total Supporters
        </p>
        <p class="text-3xl font-bold text-white">
          {realTotalSupporters || totalSupporters}
        </p>
      </div>

      <!-- Active Campaigns Card -->
      <div
        class="group relative bg-orange-900/60 backdrop-blur-xl border border-orange-500/40 rounded-2xl p-6 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1"
      >
        <div class="flex items-start justify-between mb-3">
          <div
            class="p-3 bg-orange-700/40 rounded-xl group-hover:bg-orange-600/50 transition-colors duration-300"
          >
            <TrendingUp class="w-6 h-6 text-orange-300" />
          </div>
          <div class="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
        </div>
        <p
          class="text-xs font-semibold text-orange-300 uppercase tracking-wider mb-1"
        >
          Active Campaigns
        </p>
        <p class="text-3xl font-bold text-white">{activeCampaigns}</p>
      </div>
    </div>

    <!-- Charts Grid with solid backgrounds -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Donors Chart -->
      <div
        class="bg-indigo-900/50 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-6 hover:border-cyan-400 transition-all duration-300"
      >
        <div class="flex items-center gap-3 mb-6">
          <div class="w-1 h-8 bg-cyan-400 rounded-full"></div>
          <h3 class="text-xl font-bold text-white">Top Donors</h3>
        </div>
        {#if analyticsData?.donorRanking && analyticsData.donorRanking.length > 0}
          <DonorChart donors={analyticsData.donorRanking} />
        {:else}
          <div
            class="text-center py-12 bg-indigo-950/60 rounded-xl border border-dashed border-cyan-400/30"
          >
            <div
              class="w-16 h-16 bg-indigo-800/50 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <div class="text-3xl">📊</div>
            </div>
            <p class="text-cyan-200 font-medium mb-1">
              No donor data available yet
            </p>
            <p class="text-sm text-blue-300">
              Data will appear once you receive donations
            </p>
          </div>
        {/if}
      </div>

      <!-- Daily Income Chart -->
      <div
        class="bg-teal-900/50 backdrop-blur-xl border border-teal-500/30 rounded-2xl p-6 hover:border-emerald-400 transition-all duration-300"
      >
        <div class="flex items-center gap-3 mb-6">
          <div class="w-1 h-8 bg-emerald-400 rounded-full"></div>
          <h3 class="text-xl font-bold text-white">Daily Income</h3>
        </div>
        {#if analyticsData?.dailyIncome && analyticsData.dailyIncome.length > 0}
          <IncomeChart data={analyticsData.dailyIncome} title="Daily Income" />
        {:else}
          <div
            class="text-center py-12 bg-teal-950/60 rounded-xl border border-dashed border-emerald-400/30"
          >
            <div
              class="w-16 h-16 bg-teal-800/50 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <div class="text-3xl">📈</div>
            </div>
            <p class="text-emerald-200 font-medium mb-1">
              No income data available yet
            </p>
            <p class="text-sm text-teal-300">
              Data will appear once transactions occur
            </p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Campaign Performance Table with solid purple -->
    <div
      class="bg-violet-900/50 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-6 hover:border-purple-400 transition-all duration-300"
    >
      <div class="flex items-center gap-3 mb-6">
        <div class="w-1 h-8 bg-purple-400 rounded-full"></div>
        <h3 class="text-xl font-bold text-white">Campaign Performance</h3>
      </div>
      {#if campaigns.length > 0}
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-purple-500/20">
                <th
                  class="pb-4 text-left text-xs font-bold text-purple-300 uppercase tracking-wider"
                  >Campaign</th
                >
                <th
                  class="pb-4 text-left text-xs font-bold text-purple-300 uppercase tracking-wider"
                  >Type</th
                >
                <th
                  class="pb-4 text-left text-xs font-bold text-purple-300 uppercase tracking-wider"
                  >Raised</th
                >
                <th
                  class="pb-4 text-left text-xs font-bold text-purple-300 uppercase tracking-wider"
                  >Supporters</th
                >
                <th
                  class="pb-4 text-left text-xs font-bold text-purple-300 uppercase tracking-wider"
                  >Status</th
                >
              </tr>
            </thead>
            <tbody class="divide-y divide-purple-500/10">
              {#each campaigns as campaign}
                <tr
                  class="group hover:bg-purple-800/20 transition-colors duration-200"
                >
                  <td
                    class="py-4 text-white font-semibold group-hover:text-cyan-400 transition-colors"
                    >{campaign.title}</td
                  >
                  <td class="py-4">
                    <span
                      class="text-purple-200 capitalize px-3 py-1 bg-purple-700/40 rounded-lg text-sm font-medium"
                    >
                      {campaign.type}
                    </span>
                  </td>
                  <td class="py-4">
                    <span class="text-emerald-400 font-bold"
                      >{campaign.totalRaised.toFixed(2)}</span
                    >
                    <span class="text-teal-400 text-sm ml-1">APT</span>
                  </td>
                  <td class="py-4">
                    <span class="text-blue-400 font-bold"
                      >{campaign.supporterCount}</span
                    >
                  </td>
                  <td class="py-4">
                    <span
                      class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold {campaign.isActive
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'}"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full {campaign.isActive
                          ? 'bg-green-400'
                          : 'bg-red-400'}"
                      ></span>
                      {campaign.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <div
          class="text-center py-12 bg-violet-950/60 rounded-xl border border-dashed border-purple-400/30"
        >
          <div
            class="w-16 h-16 bg-violet-800/50 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <div class="text-3xl">📋</div>
          </div>
          <p class="text-purple-200 font-medium mb-1">No campaigns found</p>
          <p class="text-sm text-violet-300">
            Create your first campaign to see performance data
          </p>
        </div>
      {/if}
    </div>

    <!-- AI Analysis Section with solid fuchsia -->
    <div
      class="relative bg-fuchsia-900/50 backdrop-blur-xl border border-fuchsia-500/30 rounded-2xl p-6 overflow-hidden"
    >
      <div
        class="absolute top-0 right-0 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl -z-10"
      ></div>
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
      >
        <div class="flex items-center gap-3">
          <div class="p-2 bg-fuchsia-700/40 rounded-xl">
            <Brain class="w-6 h-6 text-fuchsia-300" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">AI Analysis</h3>
            <p class="text-xs text-pink-300">Powered by advanced analytics</p>
          </div>
        </div>
        <button
          onclick={handleGenerateAIAnalysis}
          disabled={aiLoading}
          class="px-6 py-3 bg-fuchsia-600 text-white rounded-xl font-semibold hover:bg-fuchsia-500 hover:shadow-lg hover:shadow-fuchsia-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center gap-2 transition-all duration-300 hover:scale-105"
        >
          {#if aiLoading}
            <div
              class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            ></div>
          {/if}
          {aiLoading ? "Analyzing..." : "Generate Analysis"}
        </button>
      </div>

      {#if showAIAnalysis}
        <div
          class="bg-fuchsia-950/60 backdrop-blur-sm rounded-xl p-6 border border-fuchsia-500/20 shadow-inner"
        >
          <div>{@html aiAnalysis}</div>
        </div>
      {:else}
        <div
          class="bg-fuchsia-950/40 rounded-xl p-6 border border-dashed border-fuchsia-400/20"
        >
          <p class="text-pink-200 text-center">
            Click <span class="text-fuchsia-300 font-semibold"
              >"Generate Analysis"</span
            > to get AI-powered insights about your campaigns and performance.
          </p>
        </div>
      {/if}
    </div>
  {/if}
</div>
