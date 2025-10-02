<script lang="ts">
  import { useContract } from "@/hooks/useContract";
  import { useWallet } from "@/hooks/useWallet";
  import { MoveUpRight, Send, Wallet } from "lucide-svelte";

  let balance = $state(0n);
  const { getTotalBalance } = useContract();
  const { address } = useWallet();

  const userAddress = $derived($address);

  const init = async () => {
    if (!userAddress) return;

    try {
      const totalBalance = await getTotalBalance(userAddress);
      balance = BigInt(totalBalance);

      console.log("Total Balance:", balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  $effect(() => {
    if (!userAddress) return;
    init();
  });
</script>

<div class="flex justify-between items-center bg-gradient-to-r from-purple-700 to-indigo-600 p-6 rounded-3xl text-white shadow-lg">
  <div class="grid gap-4">
    <div class="flex items-center mb-2">
      <div
        class="bg-white/30 p-3 rounded-full mr-3 flex items-center justify-center text-purple-200 shadow-lg"
      >
        <Wallet class="h-7 w-7" />
      </div>
      <span class="text-xl font-semibold tracking-wide drop-shadow-md">Current Balance</span>
    </div>

    <div>
      <span class="text-4xl font-extrabold tracking-tight drop-shadow-lg">
        {(Number(balance) / 100000000).toFixed(2)} APT
      </span>
      <div class="flex items-center mt-1 text-green-400 font-semibold">
        <MoveUpRight class="mr-1 h-5 w-5 drop-shadow-md" />
        <span class="text-base">+12.5% this month</span>
      </div>
    </div>
  </div>

  <div class="flex flex-col items-end space-y-2">
    <button
      class="bg-white/30 hover:bg-white/50 cursor-pointer text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-3 transition duration-300 shadow-md hover:shadow-lg"
    >
      <Send class="h-5 w-5" />
      <span>Withdraw</span>
    </button>
    <p class="text-sm text-white/80 italic font-medium select-none">instant deposit</p>
  </div>
</div>
