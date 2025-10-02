<script lang="ts">
  import { useContract } from "@/hooks/useContract";
  import type { Campaign } from "@/types/types";
  import { showToast } from "@/stores/toastStore";
  import {
    Building2,
    Calendar,
    DollarSign,
    Heart,
    Link,
    Package,
    Share,
    ShoppingCart,
    User,
    X,
  } from "lucide-svelte";
  import { onMount } from "svelte";

  const {
    getCampaign,
    getCampaignBalance,
    getDonationHistory,
    getPurchaseHistory,
    donateToCampaign,
    purchaseProduct,
    purchaseBusinessService,
  } = useContract();

  let campaign: Campaign | null = null;
  let loading = true;
  let error: string | null = null;

  let creatorAddress: string;
  let campaignId: number;

  let donationAmount = 0;
  let productQuantity = 1;
  let transactionLoading = false;
  let transactionError: string | null = null;
  let transactionSuccess = false;

  const typeMap = ["donation", "business", "product"] as const;
  const OCTAS_TO_APT = 100000000;

  async function loadCampaign() {
    if (!creatorAddress || !campaignId) return;

    try {
      loading = true;
      error = null;

      const [
        id,
        campaignType,
        name,
        description,
        goal,
        price,
        image,
        isActive,
        createdBy,
        createdAt,
        updatedAt,
      ] = await getCampaign(creatorAddress, campaignId);

      const balance = await getCampaignBalance(creatorAddress, campaignId);
      const donations = await getDonationHistory(creatorAddress, campaignId);
      const purchases = await getPurchaseHistory(creatorAddress, campaignId);

      const totalRaised =
        donations.reduce((sum, d) => sum + Number(d.amount), 0) +
        purchases.reduce((sum, p) => sum + Number(p.total_amount), 0);

      const donorCount = new Set([
        ...donations.map((d) => d.donor),
        ...purchases.map((p) => p.buyer),
      ]).size;

      campaign = {
        id: id.toString(),
        type: typeMap[campaignType] || "donation",
        title: name,
        description,
        goal: Number(goal) > 0 ? Number(goal) / OCTAS_TO_APT : undefined,
        price: Number(price) > 0 ? Number(price) / OCTAS_TO_APT : undefined,
        image: image || undefined,
        paymentLink: `https://app.example.com/pay/${creatorAddress}/${id}`,
        balance: Number(balance) / OCTAS_TO_APT,
        totalRaised: totalRaised / OCTAS_TO_APT,
        donorCount,
        isActive,
        createdBy,
        createdAt: new Date(Number(createdAt) / 1000),
        updatedAt: new Date(Number(updatedAt) / 1000),
      };
    } catch (err) {
      console.error("Error loading campaign:", err);
      error = "Failed to load campaign";
    } finally {
      loading = false;
    }
  }

  async function handleDonate() {
    if (!campaign || donationAmount <= 0) return;

    try {
      transactionLoading = true;
      transactionError = null;
      transactionSuccess = false;

      const amountInOctas = Math.floor(donationAmount * OCTAS_TO_APT);
      await donateToCampaign(creatorAddress, campaignId, amountInOctas);

      transactionSuccess = true;
      donationAmount = 0;
      await loadCampaign();
    } catch (err) {
      console.error("Error donating:", err);
      transactionError =
        err instanceof Error ? err.message : "Failed to donate";
    } finally {
      transactionLoading = false;
    }
  }

  async function handlePurchaseProduct() {
    if (!campaign || productQuantity <= 0) return;

    try {
      transactionLoading = true;
      transactionError = null;
      transactionSuccess = false;

      await purchaseProduct(creatorAddress, campaignId, productQuantity);

      transactionSuccess = true;
      productQuantity = 1;
      await loadCampaign();
    } catch (err) {
      console.error("Error purchasing product:", err);
      transactionError =
        err instanceof Error ? err.message : "Failed to purchase product";
    } finally {
      transactionLoading = false;
    }
  }

  async function handlePurchaseBusiness() {
    if (!campaign) return;

    try {
      transactionLoading = true;
      transactionError = null;
      transactionSuccess = false;

      await purchaseBusinessService(creatorAddress, campaignId);

      transactionSuccess = true;
      await loadCampaign();
    } catch (err) {
      console.error("Error purchasing business service:", err);
      transactionError =
        err instanceof Error
          ? err.message
          : "Failed to purchase business service";
    } finally {
      transactionLoading = false;
    }
  }

  onMount(() => {
    const pathParts = window.location.pathname.split("/");
    creatorAddress = pathParts[2];
    campaignId = parseInt(pathParts[3]);
    loadCampaign();
  });
</script>

<!-- Fondo con gradiente púrpura -->
<div class="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 relative overflow-hidden">
  <!-- Efectos de fondo animados -->
  <div class="fixed inset-0 overflow-hidden pointer-events-none">
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-300/30 rounded-full blur-3xl animate-pulse" style="animation-delay: 1.5s;"></div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 3s;"></div>
  </div>

  <div class="relative z-10 max-w-5xl mx-auto px-4 py-6 pt-24">
    {#if loading}
      <div class="flex items-center justify-center min-h-[80vh]">
        <div class="text-center">
          <div class="relative mb-8">
            <div class="w-16 h-16 mx-auto border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
          <h3 class="text-2xl font-semibold text-gray-900 mb-2">
            Loading Campaign
          </h3>
          <p class="text-gray-600 mb-6">Fetching campaign details...</p>
        </div>
      </div>
    {:else if error}
      <div class="flex items-center justify-center min-h-[80vh]">
        <div class="text-center max-w-md mx-auto">
          <div class="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <X size={24} class="text-red-600" />
          </div>
          <h2 class="text-2xl font-semibold text-gray-900 mb-3">
            Campaign Not Found
          </h2>
          <p class="text-red-600 text-base mb-8">{error}</p>
          <button
            onclick={() => window.history.back()}
            class="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg"
          >
            ← Go Back
          </button>
        </div>
      </div>
    {:else if campaign}
      <!-- Campaign Header Card -->
      <div class="relative mb-8">
        <div class="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl shadow-purple-500/10">
          <div class="flex items-start gap-6">
            <!-- Campaign Icon -->
            <div class="relative flex-shrink-0">
              {#if campaign.image}
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  class="w-24 h-24 rounded-2xl object-cover border-2 border-purple-100 shadow-md"
                />
              {:else}
                <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center border-2 border-purple-100 shadow-md">
                  {#if campaign.type === "donation"}
                    <Heart size={32} class="text-purple-600" />
                  {:else if campaign.type === "business"}
                    <Building2 size={32} class="text-purple-600" />
                  {:else}
                    <Package size={32} class="text-purple-600" />
                  {/if}
                </div>
              {/if}
              <div class="absolute -top-1 -right-1 w-5 h-5 {campaign.isActive ? 'bg-green-500' : 'bg-red-500'} rounded-full border-2 border-white"></div>
            </div>

            <!-- Campaign Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-3">
                <h1 class="text-3xl font-bold text-gray-900 truncate">
                  {campaign.title}
                </h1>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span class="px-3 py-1 bg-purple-500/20 text-purple-600 rounded-md text-xs font-semibold border border-purple-500/20 uppercase">
                    {campaign.type}
                  </span>
                  <span class="px-3 py-1 {campaign.isActive ? 'bg-green-500/20 text-green-600 border-green-500/20' : 'bg-gray-500/20 text-gray-600 border-gray-500/20'} rounded-md text-xs font-semibold border uppercase">
                    {campaign.isActive ? "ACTIVE" : "PAUSED"}
                  </span>
                </div>
              </div>

              <p class="text-gray-600 mb-6 leading-relaxed text-base">
                {campaign.description}
              </p>

              <!-- Quick Stats -->
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 shadow-sm">
                  <div class="text-2xl font-bold bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                    {campaign.totalRaised.toFixed(2)}
                  </div>
                  <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    APT Raised
                  </div>
                </div>
                <div class="bg-white/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 shadow-sm">
                  <div class="text-2xl font-bold bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                    {campaign.donorCount}
                  </div>
                  <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supporters
                  </div>
                </div>
                <div class="bg-white/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 shadow-sm">
                  {#if campaign.goal}
                    <div class="text-2xl font-bold bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                      {Math.round((campaign.totalRaised / campaign.goal) * 100)}%
                    </div>
                    <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      of Goal
                    </div>
                  {:else if campaign.price}
                    <div class="text-2xl font-bold bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                      {campaign.price.toFixed(2)}
                    </div>
                    <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      APT per item
                    </div>
                  {:else}
                    <div class="text-2xl font-bold bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                      ∞
                    </div>
                    <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No limit
                    </div>
                  {/if}
                </div>
                <div class="bg-white/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 shadow-sm">
                  <div class="text-2xl font-bold bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                    {campaign.balance.toFixed(2)}
                  </div>
                  <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Progress & Details -->
        <div class="space-y-6">
          <!-- Progress Section -->
          {#if campaign.type === "donation" && campaign.goal}
            <div class="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-lg shadow-purple-500/5">
              <div class="flex items-center gap-2 mb-6">
                <div class="w-1 h-6 bg-gradient-to-b from-purple-600 to-indigo-600 rounded-full"></div>
                <h2 class="text-lg font-bold text-gray-900">
                  Campaign Progress
                </h2>
              </div>

              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-600">Progress</span>
                  <span class="text-sm font-bold bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {campaign.totalRaised.toFixed(2)} / {campaign.goal.toFixed(2)} APT
                  </span>
                </div>

                <!-- Progress Bar -->
                <div class="space-y-2">
                  <div class="h-2 overflow-hidden rounded-full bg-purple-100">
                    <div
                      class="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500"
                      style="width: {Math.min((campaign.totalRaised / campaign.goal) * 100, 100)}%"
                    ></div>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-500">0%</span>
                    <span class="text-sm font-bold bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      {Math.round((campaign.totalRaised / campaign.goal) * 100)}%
                    </span>
                    <span class="text-xs text-gray-500">100%</span>
                  </div>
                </div>
              </div>
            </div>
          {/if}

          <!-- Campaign Details -->
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-lg shadow-purple-500/5">
            <div class="flex items-center gap-2 mb-6">
              <div class="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
              <h2 class="text-lg font-bold text-gray-900">
                Campaign Details
              </h2>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="bg-purple-50/50 rounded-2xl p-4 border border-purple-100">
                <div class="flex items-center gap-2 mb-2">
                  <Calendar size={18} class="text-purple-600" />
                  <div class="font-semibold text-gray-900 text-sm">Created</div>
                </div>
                <div class="text-sm font-medium text-purple-700">
                  {campaign.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>

              <div class="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100">
                <div class="flex items-center gap-2 mb-2">
                  <User size={18} class="text-indigo-600" />
                  <div class="font-semibold text-gray-900 text-sm">Creator</div>
                </div>
                <div class="font-medium text-indigo-700 font-mono text-xs">
                  {campaign.createdBy?.slice(0, 6)}...{campaign.createdBy?.slice(-4)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Actions -->
        <div class="space-y-6">
          <!-- Action Section -->
          {#if campaign && campaign.isActive}
            <div class="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-lg shadow-purple-500/5">
              <div class="flex items-center gap-2 mb-6">
                <div class="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                <h2 class="text-lg font-bold text-gray-900">
                  {#if campaign.type === "donation"}
                    Make a Donation
                  {:else if campaign.type === "product"}
                    Purchase Product
                  {:else}
                    Purchase Service
                  {/if}
                </h2>
              </div>

              {#if transactionSuccess}
                <div class="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                  <div class="flex items-center gap-2">
                    <Heart size={18} class="text-green-600" />
                    <span class="text-green-800 font-semibold text-sm">
                      {#if campaign.type === "donation"}
                        Donation successful!
                      {:else}
                        Purchase successful!
                      {/if}
                    </span>
                  </div>
                </div>
              {/if}

              {#if transactionError}
                <div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <div class="flex items-center gap-2">
                    <X size={18} class="text-red-600" />
                    <span class="text-red-700 text-sm font-medium">{transactionError}</span>
                  </div>
                </div>
              {/if}

              {#if campaign.type === "donation"}
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Donation Amount (APT)
                    </label>
                    <input
                      type="number"
                      bind:value={donationAmount}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50 backdrop-blur-sm"
                      disabled={transactionLoading}
                    />
                  </div>
                  <button
                    onclick={handleDonate}
                    disabled={transactionLoading || donationAmount <= 0}
                    class="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                  >
                    {#if transactionLoading}
                      <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    {:else}
                      <Heart size={18} />
                      <span>Donate{donationAmount > 0 ? ` ${donationAmount} APT` : ""}</span>
                    {/if}
                  </button>
                </div>
              {:else if campaign.type === "product"}
                <div class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        bind:value={productQuantity}
                        min="1"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/50 backdrop-blur-sm"
                        disabled={transactionLoading}
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-2">
                        Total Cost
                      </label>
                      <div class="w-full px-4 py-3 bg-purple-50/50 border border-purple-100 rounded-xl font-bold bg-gradient-to-br from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        {(productQuantity * (campaign.price || 0)).toFixed(2)} APT
                      </div>
                    </div>
                  </div>
                  <button
                    onclick={handlePurchaseProduct}
                    disabled={transactionLoading || productQuantity <= 0}
                    class="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                  >
                    {#if transactionLoading}
                      <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    {:else}
                      <ShoppingCart size={18} />
                      <span>Purchase Product</span>
                    {/if}
                  </button>
                </div>
              {:else}
                <div class="space-y-4">
                  <div class="bg-purple-50/50 border border-purple-100 rounded-xl p-4">
                    <div class="flex items-center gap-2 mb-2">
                      <DollarSign size={18} class="text-purple-600" />
                      <span class="text-purple-900 font-bold">
                        Service Cost: {campaign.price} APT
                      </span>
                    </div>
                    <p class="text-purple-700 text-sm">
                      Purchase this business service to support the campaign.
                    </p>
                  </div>
                  <button
                    onclick={handlePurchaseBusiness}
                    disabled={transactionLoading}
                    class="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                  >
                    {#if transactionLoading}
                      <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    {:else}
                      <Building2 size={18} />
                      <span>Purchase Service</span>
                    {/if}
                  </button>
                </div>
              {/if}
            </div>
          {/if}

          <!-- Share Section -->
          <div class="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-lg shadow-purple-500/5">
            <div class="flex items-center gap-2 mb-6">
              <div class="w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
              <h2 class="text-lg font-bold text-gray-900">
                Share with others
              </h2>
            </div>

            <div class="space-y-3">
              <div class="bg-purple-50/50 rounded-xl p-4 border border-purple-100">
                <div class="flex items-start gap-3 mb-3">
                  <div class="p-2 bg-purple-100 rounded-lg">
                    <Link size={18} class="text-purple-600" />
                  </div>
                  <div>
                    <div class="font-semibold text-gray-900 text-sm">
                      Share with others
                    </div>
                    <div class="text-xs text-gray-600 mt-1">
                      Let others discover this campaign
                    </div>
                  </div>
                </div>

                <button
                  onclick={async () => {
                    await navigator.clipboard.writeText(
                      `${window.location.origin}/campaign/${creatorAddress}/${campaignId}`
                    );
                    showToast('Link copied to clipboard!', 'success');
                  }}
                  class="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
                >
                  <Link size={16} />
                  <span>Copy Share Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
