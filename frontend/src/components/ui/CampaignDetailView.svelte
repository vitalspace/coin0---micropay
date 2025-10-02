<script lang="ts">
  import type { Campaign, Payment, Donor } from "@/types/types";
  import BalanceCard from './BalanceCard.svelte';
  import HistoryTable from './HistoryTable.svelte';
  import TopDonorsList from './TopDonorsList.svelte';
  import WithdrawButton from './WithdrawButton.svelte';

  interface Props {
    campaign: Campaign;
    payments: Payment[];
    donors: Donor[];
    onWithdraw: (amount: number) => Promise<void>;
  }

  let { campaign, payments, donors, onWithdraw }: Props = $props();

  // Mock additional data for different campaign types
  let goalProgress = $derived(campaign.type === 'donation' && campaign.goal ? (campaign.totalRaised / campaign.goal) * 100 : 0);
  let salesCount = $derived(campaign.type === 'product' ? Math.floor(campaign.totalRaised / (campaign.price || 1)) : 0);
</script>

<div class="space-y-8">
  <!-- Campaign Header -->
  <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 shadow-lg">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-4">
        <div class="text-4xl">
          {campaign.type === 'donation' ? '💝' : campaign.type === 'business' ? '🏪' : '📦'}
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">{campaign.title}</h2>
          <p class="text-gray-300">{campaign.description}</p>
          <div class="flex items-center gap-2 mt-2">
            <span class="inline-block px-3 py-1 rounded-full text-sm font-medium {campaign.type === 'donation' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : campaign.type === 'business' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}">
              {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)} Campaign
            </span>
            <span class="inline-block px-3 py-1 rounded-full text-sm font-medium {campaign.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}">
              {campaign.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
      <div class="text-right">
        <p class="text-sm text-gray-400">Payment Link</p>
        <div class="flex items-center gap-2">
          <code class="bg-slate-700/50 px-2 py-1 rounded text-xs text-cyan-300 font-mono">{campaign.paymentLink}</code>
          <button
            onclick={() => navigator.clipboard.writeText(campaign.paymentLink)}
            class="text-cyan-400 hover:text-cyan-300 text-sm"
            title="Copy link"
          >
            📋
          </button>
        </div>
      </div>
    </div>

    <!-- Type-specific metrics -->
    {#if campaign.type === 'donation' && campaign.goal}
      <div class="bg-slate-700/30 rounded-lg p-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-gray-300">Fundraising Progress</span>
          <span class="text-white font-semibold">{campaign.totalRaised} / {campaign.goal} APT</span>
        </div>
        <div class="w-full bg-slate-600 rounded-full h-3">
          <div class="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-500" style="width: {Math.min(goalProgress, 100)}%"></div>
        </div>
        <p class="text-sm text-gray-400 mt-1">{goalProgress.toFixed(1)}% funded</p>
      </div>
    {:else if campaign.type === 'product' && campaign.price}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <p class="text-2xl font-bold text-emerald-400">{salesCount}</p>
          <p class="text-sm text-gray-400">Units Sold</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-white">{campaign.price} APT</p>
          <p class="text-sm text-gray-400">Price per Unit</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-white">{campaign.totalRaised} APT</p>
          <p class="text-sm text-gray-400">Total Revenue</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-white">{campaign.donorCount}</p>
          <p class="text-sm text-gray-400">Customers</p>
        </div>
      </div>
    {:else if campaign.type === 'business'}
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <p class="text-2xl font-bold text-purple-400">{campaign.totalRaised} APT</p>
          <p class="text-sm text-gray-400">Tips Received</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-white">{campaign.donorCount}</p>
          <p class="text-sm text-gray-400">Happy Customers</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-white">{(campaign.totalRaised / Math.max(campaign.donorCount, 1)).toFixed(2)} APT</p>
          <p class="text-sm text-gray-400">Avg Tip</p>
        </div>
        <div class="text-center">
          <p class="text-2xl font-bold text-white">{campaign.balance} APT</p>
          <p class="text-sm text-gray-400">Available Balance</p>
        </div>
      </div>
    {/if}
  </div>

  <!-- Campaign-specific content -->
  {#if campaign.type === 'donation'}
    <!-- Donation-specific: Recent donor messages -->
    <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 shadow-lg">
      <h3 class="text-lg font-semibold text-cyan-300 mb-4">Recent Donor Messages</h3>
      <div class="space-y-3">
        {#each payments.slice(0, 5) as payment}
          <div class="bg-slate-700/30 rounded-lg p-4">
            <div class="flex justify-between items-start mb-2">
              <span class="text-white font-medium">{payment.from.slice(0, 6)}...{payment.from.slice(-4)}</span>
              <span class="text-cyan-400 font-semibold">{payment.amount} APT</span>
            </div>
            {#if payment.message}
              <p class="text-gray-300 italic">"{payment.message}"</p>
            {:else}
              <p class="text-gray-500">No message</p>
            {/if}
            <p class="text-xs text-gray-500 mt-1">{payment.timestamp.toLocaleDateString()}</p>
          </div>
        {/each}
      </div>
    </div>
  {:else if campaign.type === 'business'}
    <!-- Business-specific: Customer feedback simulation -->
    <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 shadow-lg">
      <h3 class="text-lg font-semibold text-purple-300 mb-4">Customer Feedback</h3>
      <div class="space-y-3">
        <div class="bg-slate-700/30 rounded-lg p-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-yellow-400">⭐⭐⭐⭐⭐</span>
            <span class="text-white font-medium">Great service!</span>
          </div>
          <p class="text-gray-300">"Excellent coffee and friendly staff. Will definitely come back!"</p>
        </div>
        <div class="bg-slate-700/30 rounded-lg p-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-yellow-400">⭐⭐⭐⭐⭐</span>
            <span class="text-white font-medium">Quick and efficient</span>
          </div>
          <p class="text-gray-300">"Fast service and great atmosphere. Perfect for a quick break."</p>
        </div>
      </div>
    </div>
  {:else if campaign.type === 'product'}
    <!-- Product-specific: Sales analytics -->
    <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-emerald-500/20 rounded-lg p-6 shadow-lg">
      <h3 class="text-lg font-semibold text-emerald-300 mb-4">Sales Performance</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="text-center">
          <p class="text-3xl font-bold text-emerald-400">{salesCount}</p>
          <p class="text-sm text-gray-400">Total Sales</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold text-white">{campaign.price} APT</p>
          <p class="text-sm text-gray-400">Unit Price</p>
        </div>
        <div class="text-center">
          <p class="text-3xl font-bold text-white">{(campaign.totalRaised / Math.max(salesCount, 1)).toFixed(2)} APT</p>
          <p class="text-sm text-gray-400">Avg Revenue</p>
        </div>
      </div>
    </div>
  {/if}

  <!-- Common sections: Balance, Withdraw, History, Top Donors -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div class="space-y-8">
      <BalanceCard balance={campaign.balance} />
      <WithdrawButton balance={campaign.balance} onWithdraw={onWithdraw} />
    </div>
    <div class="space-y-8">
      <HistoryTable {payments} />
      <TopDonorsList {donors} />
    </div>
  </div>
</div>