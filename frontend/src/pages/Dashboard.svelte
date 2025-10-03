<script lang="ts">
  import { showNwewCampaignModal, activeTab } from "@/stores/stores";
  import Campaigns from "@/components/dashboard/Campaigns/Campaigns.svelte";
  import Main from "@/components/dashboard/main/Main.svelte";
  import Profile from "@/components/dashboard/profile/Profile.svelte";
  import Sts from "@/components/dashboard/settings/Settings.svelte";
  import Messages from "@/components/dashboard/Messages/Messages.svelte";
  import Analytics from "@/components/dashboard/analytics/Analytics.svelte";
  import { Briefcase, Folder, Settings, User, MessageCircle, BarChart3 } from "lucide-svelte";
  import { fade } from "svelte/transition";
  import NewCampaign from "@/components/dashboard/Campaigns/newCampaign.svelte";
  import WalletConnectionGuard from "@/components/ui/WalletConnectionGuard.svelte";
</script>
  {#if $showNwewCampaignModal}
    <NewCampaign onBack={() => showNwewCampaignModal.set(false)} />
  {/if}

<WalletConnectionGuard>
<section class="min-h-screen bg-gradient-to-br from-purple-200 via-teal-50 to-white relative pt-28 pb-10 overflow-x-hidden">
  <!-- Background animated orbs & shapes -->
  <div class="absolute inset-0 pointer-events-none overflow-hidden">
    <div class="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 via-cyan-400/15 to-transparent rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-500/18 via-purple-400/12 to-transparent rounded-full blur-3xl animate-float-slow"></div>
    <div class="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-teal-400/10 to-transparent rounded-full blur-3xl animate-float-slow-reverse"></div>

    <div class="absolute top-32 left-20 w-16 h-16 bg-gradient-to-br from-blue-400/25 to-cyan-400/15 rounded-2xl rotate-12 blur-sm animate-float"></div>
    <div class="absolute top-64 right-32 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-indigo-400/15 rounded-full blur-sm animate-float-reverse"></div>
    <div class="absolute bottom-48 left-16 w-10 h-10 bg-gradient-to-br from-teal-400/25 to-cyan-400/15 rounded-xl rotate-45 blur-sm animate-float"></div>
    <div class="absolute bottom-64 right-20 w-14 h-14 bg-gradient-to-br from-indigo-400/20 to-blue-400/15 rounded-3xl -rotate-12 blur-sm animate-float-reverse"></div>

    <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0); background-size: 32px 32px;"></div>
    <div class="absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] via-transparent to-cyan-500/[0.04]"></div>
  </div>

  <style>
    @keyframes float {
      0%, 100% { transform: translateY(0px) translateX(0px); }
      33% { transform: translateY(-20px) translateX(10px); }
      66% { transform: translateY(10px) translateX(-5px); }
    }
    .animate-float { animation: float 4s ease-in-out infinite; }
    .animate-float-reverse { animation: float 5s ease-in-out infinite reverse; }
    .animate-float-slow { animation: float 6s ease-in-out infinite; }
    .animate-float-slow-reverse { animation: float 8s ease-in-out infinite reverse; }
  </style>

  <div class="container mx-auto px-4 max-w-7xl relative z-10">
    <!-- Header -->
    <header class="mb-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-20 pointer-events-none"></div>

      <div class="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
        <div class="space-y-2">
          <h1 class="text-5xl font-extrabold drop-shadow-lg">Dashboard</h1>
          <p class="text-lg text-white/90 font-medium max-w-lg">
            Manage your earnings and campaigns with powerful insights
          </p>
        </div>

        <!-- Tab navigation -->
        <nav class="bg-white/20 backdrop-blur-sm p-2 rounded-2xl border border-white/20 shadow-sm">
          <div class="flex flex-wrap md:flex-nowrap gap-2">
            {#each [
              { label: 'Main', icon: Folder, index: 0 },
              { label: 'Campaigns', icon: Briefcase, index: 1 },
              { label: 'Messages', icon: MessageCircle, index: 2 },
              { label: 'Analytics', icon: BarChart3, index: 3 },
              { label: 'Profile', icon: User, index: 4 },
              { label: 'Settings', icon: Settings, index: 5 }
            ] as tab}
              <button
                on:click={() => ($activeTab = tab.index)}
                class="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-transform duration-200
                  { $activeTab === tab.index
                    ? 'bg-white/90 backdrop-blur-sm text-blue-700 shadow-md scale-105'
                    : 'text-white/70 hover:text-white hover:bg-white/20' }"
                aria-current={$activeTab === tab.index ? "page" : undefined}
                aria-label={`Go to ${tab.label} tab`}
              >
                <svelte:component this={tab.icon} class="w-5 h-5" />
                {tab.label}
              </button>
            {/each}
          </div>
        </nav>
      </div>
    </header>

    <!-- Content Wrapper -->
    <main class="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/30 shadow-lg p-6 md:p-8 min-h-[600px]">
      {#key $activeTab}
        <div in:fade={{ duration: 200 }} out:fade={{ duration: 150 }}>
          {#if $activeTab === 0}
            <Main />
          {:else if $activeTab === 1}
            <Campaigns />
          {:else if $activeTab === 2}
            <Messages />
          {:else if $activeTab === 3}
            <Analytics />
          {:else if $activeTab === 4}
            <Profile />
          {:else}
            <Sts />
          {/if}
        </div>
      {/key}
    </main>
  </div>
</section>
</WalletConnectionGuard>
