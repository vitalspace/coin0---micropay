<script lang="ts">
  interface Props {
    balance: number;
  }

  let { balance }: Props = $props();
</script>

<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 shadow-lg">
  <h3 class="text-lg font-semibold text-cyan-300 mb-2">Current Balance</h3>
  <p class="text-3xl font-bold text-white">{balance.toFixed(2)} APT</p>
  <p class="text-sm text-gray-400 mt-1">Accumulated tips</p>
</div>