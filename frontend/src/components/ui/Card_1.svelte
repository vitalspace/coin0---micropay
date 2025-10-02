<script lang="ts">
  const { 
    icon: Icon, 
    title, 
    description, 
    action = undefined, 
    onAction = undefined, 
    iconClass = "h-6 w-6 text-purple-600", 
    variant = "default",
    class: additionalClass = ""
  } = $props();
  
  // Variantes actualizadas con tema púrpura/índigo
  const variants = {
    default: {
      icon: "bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700",
      glow: "group-hover:shadow-purple-500/25",
      accent: "from-purple-500/15 to-indigo-500/10",
      button: "from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700",
      border: "border-purple-200/40 hover:border-purple-300/60"
    },
    purple: {
      icon: "bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600",
      glow: "group-hover:shadow-purple-500/25",
      accent: "from-purple-500/15 to-pink-500/10",
      button: "from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800",
      border: "border-purple-200/40 hover:border-purple-300/60"
    },
    indigo: {
      icon: "bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700",
      glow: "group-hover:shadow-indigo-500/25",
      accent: "from-indigo-500/15 to-blue-500/10",
      button: "from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800",
      border: "border-indigo-200/40 hover:border-indigo-300/60"
    },
    teal: {
      icon: "bg-gradient-to-br from-teal-600 via-cyan-600 to-teal-700",
      glow: "group-hover:shadow-teal-500/25",
      accent: "from-teal-500/15 to-cyan-500/10",
      button: "from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800",
      border: "border-teal-200/40 hover:border-teal-300/60"
    }
  };
  
  const currentVariant = variants[variant] || variants.default;
</script>

<div class="group relative bg-white/80 backdrop-blur-xl rounded-3xl border {currentVariant.border} p-8 hover:shadow-2xl {currentVariant.glow} transition-all duration-500 hover:scale-[1.02] cursor-pointer overflow-hidden {additionalClass}">
  
  <!-- Efectos de fondo glassmórficos -->
  <div class="absolute inset-0 bg-gradient-to-br {currentVariant.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
  
  <!-- Elementos decorativos con blur -->
  <div class="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-white/30 to-purple-100/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 opacity-60"></div>
  <div class="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-tr from-indigo-100/30 to-white/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500 opacity-50"></div>
  
  <!-- Contenido principal -->
  <div class="relative z-10">
    <div class="flex items-start space-x-6 mb-6">
      <!-- Ícono mejorado -->
      <div class="relative flex-shrink-0">
        <div class="{currentVariant.icon} p-4 rounded-2xl shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 ring-2 ring-white/30">
          <Icon class="h-7 w-7 text-white drop-shadow-sm" />
        </div>
        <!-- Efecto de resplandor -->
        <div class="absolute inset-0 {currentVariant.icon} p-4 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
      </div>
      
      <div class="flex-1 min-w-0">
        <h3 class="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-200 mb-3 leading-tight">{title}</h3>
        <!-- Línea animada más sutil -->
        <div class="h-1 w-0 bg-gradient-to-r {currentVariant.button} group-hover:w-16 transition-all duration-500 rounded-full"></div>
      </div>
    </div>

    <p class="text-gray-600 leading-relaxed mb-8 group-hover:text-gray-700 transition-colors duration-200 text-base">{description}</p>

    {#if action}
      <button
        class="group/btn w-full bg-gradient-to-r {currentVariant.button} text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl active:scale-95 relative overflow-hidden"
        onclick={onAction}
      >
        <!-- Efecto de brillo mejorado -->
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
        
        <!-- Texto del botón -->
        <span class="relative z-10 flex items-center justify-center gap-3 text-base">
          {action}
          <svg class="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </span>
      </button>
    {/if}
  </div>
</div>
