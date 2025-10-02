<script lang="ts">
  import type { Donor } from "@/types/types";

  interface Props {
    donors: Donor[];
  }

  let { donors }: Props = $props();
</script>

<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 shadow-lg">
  <h3 class="text-lg font-semibold text-cyan-300 mb-4">Top Donors</h3>
  <div class="space-y-3">
    {#each donors as donor, index}
      <div class="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {index + 1}
          </div>
          <div>
            <p class="text-white font-mono text-xs">{donor.address}</p>
            <p class="text-gray-400 text-xs">{donor.paymentCount} payments</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-white font-semibold">{donor.totalAmount} APT</p>
        </div>
      </div>
    {/each}
  </div>
</div>