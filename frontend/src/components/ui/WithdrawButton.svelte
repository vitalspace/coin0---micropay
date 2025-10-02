<script lang="ts">
  interface Props {
    onWithdraw: (amount: number) => Promise<void>;
    balance: number;
  }

  let { onWithdraw, balance }: Props = $props();
  let amount = $state(0);
  let loading = $state(false);

  async function handleWithdraw() {
    if (amount <= 0 || amount > balance) return;
    loading = true;
    try {
      await onWithdraw(amount);
      amount = 0; // Reset
    } catch (error) {
      console.error('Withdraw failed:', error);
    } finally {
      loading = false;
    }
  }
</script>

<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 shadow-lg">
  <h3 class="text-lg font-semibold text-cyan-300 mb-4">Withdraw Funds</h3>
  <div class="space-y-4">
    <div>
      <label class="block text-sm text-gray-400 mb-2">Amount to withdraw (APT)</label>
      <input
        type="number"
        bind:value={amount}
        max={balance}
        min="0"
        step="0.01"
        class="w-full px-3 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
        placeholder="Enter amount"
      />
    </div>
    <button
      onclick={handleWithdraw}
      disabled={loading || amount <= 0 || amount > balance}
      class="w-full relative group px-4 py-2 cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div class="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-lg opacity-90 group-hover:opacity-100 transition-all duration-300"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-green-400/30 via-emerald-400/30 to-teal-400/30 rounded-lg blur-sm group-hover:blur-md transition-all duration-300"></div>
      <span class="relative z-10 text-white font-semibold">
        {#if loading}
          Withdrawing...
        {:else}
          Withdraw Funds
        {/if}
      </span>
    </button>
  </div>
</div>