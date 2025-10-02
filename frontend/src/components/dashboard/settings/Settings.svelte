<script lang="ts">
  import Notifications from "@/components/dashboard/settings/Notifications.svelte";
  import Privacy from "@/components/dashboard/settings/Privacy.svelte";
  import ProfileSettings from "@/components/dashboard/settings/ProfileSettings.svelte";
  import { Settings, Shield, Bell, User } from "lucide-svelte";
</script>

<div class="max-w-7xl mx-auto">
  <!-- Header Section mejorado -->
  <div class="mb-8">
    <div class="bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-400 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
      <!-- Efectos de fondo -->
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-30"></div>
      <div class="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div class="absolute -bottom-4 -left-4 w-24 h-24 bg-orange-400/20 rounded-full blur-xl"></div>
      
      <div class="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <!-- Contenido principal -->
        <div class="space-y-3">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Settings class="h-6 w-6 text-white" />
            </div>
            <h2 class="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              Settings
            </h2>
          </div>
          
          <div class="text-white/90 text-base md:text-lg font-medium flex items-center gap-3">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>
              <span>Manage your account and preferences</span>
            </div>
          </div>

          <!-- Mini info inline -->
          <div class="flex items-center gap-6 mt-4">
            <div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
              <Shield class="h-4 w-4 text-orange-200" />
              <span class="text-sm font-semibold text-white/90">Secure settings</span>
            </div>
          </div>
        </div>

        <!-- Botón de guardado -->
        <!-- <div class="flex flex-col items-end gap-3">
          <button
            class="bg-white/20 hover:bg-white/30 backdrop-blur-sm cursor-pointer text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
          >
            <div class="p-1 bg-white/20 rounded-lg">
              <Settings class="h-5 w-5" />
            </div>
            <span class="text-base">Save Changes</span>
          </button>
          
          <p class="text-xs text-white/70 italic">Auto-save enabled</p>
        </div> -->
      </div>
    </div>
  </div>

  <!-- Main Content Grid con glassmorfismo -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Left Column - Profile Settings -->
    <div class="lg:col-span-2">
        <ProfileSettings />
    </div>

    <!-- Right Column - Notifications & Privacy -->
    <div class="space-y-6">
      <!-- Notifications Section -->
      <div class="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-lg ">
        <div class="flex items-center gap-3 px-6 pt-6">
          <div class="w-1 h-6 bg-gradient-to-b from-yellow-500 to-amber-500 rounded-full"></div>
          <h3 class="text-xl font-bold text-gray-900">Notifications</h3>
        </div>
        <Notifications />
      </div>

      <!-- Privacy Section -->
      <div class="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-lg">
        <div class="flex items-center gap-3 px-6 pt-6">
          <div class="w-1 h-6 bg-gradient-to-b from-orange-500 to-amber-600 rounded-full"></div>
          <h3 class="text-xl font-bold text-gray-900">Privacy & Security</h3>
        </div>
        <Privacy />
      </div>

      <!-- Quick Settings Card -->
      <div class="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-lg p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-1 h-6 bg-gradient-to-b from-amber-600 to-yellow-500 rounded-full"></div>
          <h3 class="text-xl font-bold text-gray-900">Quick Actions</h3>
        </div>
        
        <div class="space-y-3">
          <button class="w-full text-left p-3 rounded-2xl bg-amber-50/50 hover:bg-amber-100/50 border border-amber-100/50 transition-all duration-200 group">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200">
                <User class="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <div class="font-semibold text-gray-900 text-sm">Reset Profile</div>
                <div class="text-xs text-gray-600">Restore default settings</div>
              </div>
            </div>
          </button>

          <button class="w-full text-left p-3 rounded-2xl bg-orange-50/50 hover:bg-orange-100/50 border border-orange-100/50 transition-all duration-200 group">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200">
                <Bell class="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <div class="font-semibold text-gray-900 text-sm">Test Notifications</div>
                <div class="text-xs text-gray-600">Send a test notification</div>
              </div>
            </div>
          </button>

          <button class="w-full text-left p-3 rounded-2xl bg-yellow-50/50 hover:bg-yellow-100/50 border border-yellow-100/50 transition-all duration-200 group">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200">
                <Shield class="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <div class="font-semibold text-gray-900 text-sm">Security Audit</div>
                <div class="text-xs text-gray-600">Check account security</div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
