<script lang="ts">
  import { showNwewCampaignModal } from "@/stores/stores";
  import { Plus, TrendingUp, Target } from "lucide-svelte";
  import AllCampaigns from "./allCampaigns.svelte";
</script>

<div class="max-w-7xl mx-auto">
  <!-- Header Section con glassmorfismo -->
  <div class="mb-8">
    <div class="bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
      <!-- Efectos de fondo -->
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-30"></div>
      <div class="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div class="absolute -bottom-4 -left-4 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl"></div>
      
      <div class="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <!-- Contenido principal -->
        <div class="space-y-3">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Target class="h-6 w-6 text-white" />
            </div>
            <h2 class="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              Campaigns
            </h2>
          </div>
          
          <!-- Cambié <p> por <div> para evitar el anidamiento inválido -->
          <div class="text-white/90 text-base md:text-lg font-medium">
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>Manage your fundraising campaigns</span>
            </div>
          </div>

          <!-- Mini stats inline -->
          <div class="flex items-center gap-6 mt-4">
            <div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
              <TrendingUp class="h-4 w-4 text-green-300" />
              <span class="text-sm font-semibold text-white/90">Active campaigns</span>
            </div>
          </div>
        </div>

        <!-- Botón mejorado -->
        <div class="flex flex-col items-end gap-3">
          <button
            on:click={() => showNwewCampaignModal.set(true)}
            class="bg-white/20 hover:bg-white/30 backdrop-blur-sm cursor-pointer text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
          >
            <div class="p-1 bg-white/20 rounded-lg">
              <Plus class="h-5 w-5" />
            </div>
            <span class="text-base">New Campaign</span>
          </button>
          
          <p class="text-xs text-white/70 italic">Start your next project</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
    <AllCampaigns />
</div>
