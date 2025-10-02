<script lang="ts">
  import type { Payment } from "@/types/types";

  interface Props {
    payments: Payment[];
  }

  let { payments }: Props = $props();
</script>

<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 shadow-lg">
  <h3 class="text-lg font-semibold text-cyan-300 mb-4">Payment History</h3>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-cyan-500/20">
          <th class="text-left py-2 text-cyan-300">From</th>
          <th class="text-left py-2 text-cyan-300">Amount</th>
          <th class="text-left py-2 text-cyan-300">Date</th>
          <th class="text-left py-2 text-cyan-300">Message</th>
        </tr>
      </thead>
      <tbody>
        {#each payments as payment}
          <tr class="border-b border-slate-700/50">
            <td class="py-2 text-gray-300 font-mono text-xs">{payment.from}</td>
            <td class="py-2 text-white">{payment.amount} APT</td>
            <td class="py-2 text-gray-400">{payment.timestamp.toLocaleDateString()}</td>
            <td class="py-2 text-gray-400">{payment.message || '-'}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>