<script>
  import { Eye, Settings, User } from "lucide-svelte";
  import ProfilePreview from "./ProfilePreview.svelte";
  import ProfileStats from "./ProfileStats.svelte";

  import { activeTab } from "@/stores/stores";
</script>

<div class="max-w-7xl mx-auto">
  <!-- Header Section mejorado con color original -->
  <div class="mb-8">
    <div
      class="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-400 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden"
    >
      <!-- Efectos de fondo -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-30"
      ></div>
      <div
        class="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"
      ></div>
      <div
        class="absolute -bottom-4 -left-4 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl"
      ></div>

      <div
        class="relative z-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6"
      >
        <!-- Contenido principal -->
        <div class="space-y-3">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <User class="h-6 w-6 text-white" />
            </div>
            <h2
              class="text-3xl md:text-4xl font-bold text-white drop-shadow-lg"
            >
              Public Profile
            </h2>
          </div>

          <div
            class="text-white/90 text-base md:text-lg font-medium flex items-center gap-3"
          >
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"
              ></span>
              <span>Manage your public profile settings and preferences</span>
            </div>
          </div>

          <!-- Mini info inline -->
          <div class="flex items-center gap-6 mt-4">
            <div
              class="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg"
            >
              <Eye class="h-4 w-4 text-green-300" />
              <span class="text-sm font-semibold text-white/90"
                >Public visibility</span
              >
            </div>
          </div>
        </div>

        <!-- Botón de configuración -->
        <div class="flex flex-col items-end gap-3">
          <button
            onclick={() => activeTab.set(3)}
            class="bg-white/20 hover:bg-white/30 backdrop-blur-sm cursor-pointer text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
          >
            <div class="p-1 bg-white/20 rounded-lg">
              <Settings class="h-5 w-5" />
            </div>
            <span class="text-base">Profile Settings</span>
          </button>

          <p class="text-xs text-white/70 italic">Customize your appearance</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content Grid con glassmorfismo -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div class="lg:col-span-2">
      <ProfilePreview />
    </div>

    <!-- Right Column - Settings & Stats -->
    <div class="space-y-6">
      <div
        class="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-lg p-6"
      >
        <div class="flex items-center gap-3 mb-6">
          <div
            class="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"
          ></div>
          <h3 class="text-xl font-bold text-gray-900">Profile Statistics</h3>
        </div>
        <ProfileStats />
      </div>

      <!-- Card adicional para configuración futura -->
      <div
        class="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-lg p-6"
      >
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-1 h-6 bg-gradient-to-b from-teal-500 to-green-500 rounded-full"
          ></div>
          <h3 class="text-xl font-bold text-gray-900">Quick Actions</h3>
        </div>

        <div class="space-y-3">
          <button
            class="w-full text-left p-3 rounded-2xl bg-green-50/50 hover:bg-green-100/50 border border-green-100/50 transition-all duration-200 group"
          >
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 rounded-lg group-hover:bg-green-200">
                <Eye class="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div class="font-semibold text-gray-900 text-sm">
                  Preview Public Profile
                </div>
                <div class="text-xs text-gray-600">
                  See how others view your profile
                </div>
              </div>
            </div>
          </button>

          <button
            class="w-full text-left p-3 rounded-2xl bg-emerald-50/50 hover:bg-emerald-100/50 border border-emerald-100/50 transition-all duration-200 group"
          >
            <div class="flex items-center gap-3">
              <div
                class="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200"
              >
                <Settings class="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <div class="font-semibold text-gray-900 text-sm">
                  Advanced Settings
                </div>
                <div class="text-xs text-gray-600">
                  Customize profile behavior
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
