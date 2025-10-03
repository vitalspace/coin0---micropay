<script lang="ts">
  import { onMount } from "svelte";
  import { useWallet } from "@/hooks/useWallet";

  let loading = true;
  const { isConnected, connect, checkConnection } = useWallet();

  onMount(async () => {
    await checkConnection();
    loading = false;
  });
</script>

{#if loading}
  <!-- Enhanced Loader -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100">
    <div class="flex flex-col items-center gap-6">
      <!-- Modern loading animation -->
      <div class="relative">
        <div class="w-16 h-16 border-4 border-violet-200 rounded-full animate-spin border-t-violet-600"></div>
        <div class="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-purple-500"></div>
      </div>
      
      <!-- Loading text with fade animation -->
      <div class="flex items-center gap-2 text-violet-700">
        <span class="text-sm font-medium">Initializing MicroPay</span>
        <div class="flex gap-1">
          <div class="w-1 h-1 bg-violet-600 rounded-full animate-bounce"></div>
          <div class="w-1 h-1 bg-violet-600 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-1 h-1 bg-violet-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>
    </div>
  </div>
{:else if !$isConnected}
  <!-- Enhanced Connect Wallet Screen -->
  <div class="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 px-4">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-20 -left-20 w-80 h-80 bg-violet-300 rounded-full opacity-20 blur-3xl"></div>
      <div class="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-300 rounded-full opacity-20 blur-3xl"></div>
      <div class="absolute top-1/2 left-1/4 w-32 h-32 bg-fuchsia-300 rounded-full opacity-15 blur-2xl"></div>
    </div>
    
    <!-- Main content card -->
    <div class="relative w-full max-w-md">
      <!-- Glass morphism card -->
      <div class="bg-white/80 backdrop-blur-xl rounded-3xl border border-violet-200/50 shadow-2xl p-8 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
        <!-- Header with icon -->
        <div class="text-center mb-8">
          <!-- Logo/Icon placeholder -->
          <div class="mx-auto w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Connect your Wallet</h2>
          <p class="text-gray-600 text-sm leading-relaxed">
            Connect your Aptos wallet to access the dashboard and manage your campaigns securely
          </p>
        </div>

        <!-- Features list -->
        <div class="space-y-3 mb-8">
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <div class="w-5 h-5 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>Secure and encrypted connection</span>
          </div>
          
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <div class="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span>Full control of your assets</span>
          </div>
          
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <div class="w-5 h-5 bg-fuchsia-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-3 h-3 text-fuchsia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span>Fast transactions on Aptos</span>
          </div>
        </div>

        <!-- Connect button -->
        <button
          on:click={connect}
          class="group relative w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 hover:from-violet-700 hover:to-purple-700 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-violet-200 active:scale-95"
        >
          <span class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Connect Wallet
          </span>
          
          <!-- Button glow effect -->
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
        </button>

        <!-- Security notice -->
        <div class="mt-6 p-4 bg-violet-50 rounded-xl border border-violet-200">
          <div class="flex items-start gap-3">
            <div class="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-violet-800 font-medium mb-1">Secure connection</p>
              <p class="text-xs text-violet-700 leading-relaxed">
                Your wallet remains under your control. We only share your public address for authentication.
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>
  </div>
{:else}
  <slot />
{/if}
