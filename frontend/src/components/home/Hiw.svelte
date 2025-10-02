<script lang="ts">
  import { Sparkles, Wallet, Link, CheckCircle } from "lucide-svelte";
</script>

<section
  class="relative py-32 px-8 text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden group"
>
  <!-- Animated Grid Pattern -->
  <div
    class="absolute inset-0 opacity-15"
    style="background-image: linear-gradient(rgba(255,215,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,20,147,0.15) 1px, transparent 1px); background-size: 50px 50px;"
  ></div>

  <!-- Floating Particles -->
  <div
    class="absolute top-20 left-20 w-2 h-2 bg-yellow-400 rounded-full opacity-70 animate-pulse"
    style="animation: floatUp 6s ease-in-out infinite, pulse 3s ease-in-out infinite; animation-delay: 0s;"
  ></div>
  <div
    class="absolute top-40 right-32 w-1 h-1 bg-pink-400 rounded-full opacity-50 animate-pulse"
    style="animation: floatUp 8s ease-in-out infinite reverse, pulse 4s ease-in-out infinite; animation-delay: 2s;"
  ></div>
  <div
    class="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-60 animate-pulse"
    style="animation: floatUp 7s ease-in-out infinite, pulse 3.5s ease-in-out infinite; animation-delay: 4s;"
  ></div>
  <div
    class="absolute bottom-20 right-20 w-1 h-1 bg-yellow-400 rounded-full opacity-40 animate-pulse"
    style="animation: floatUp 5s ease-in-out infinite reverse, pulse 2.5s ease-in-out infinite; animation-delay: 1s;"
  ></div>

  <div class="relative z-10 max-w-7xl mx-auto">
    <!-- Section Header -->
    <div class="mb-10 animate-fadeInUp relative">
      <!-- Glassmorphism Container -->
      <div
        class="relative bg-gradient-to-br from-slate-800/40 via-slate-800/20 to-slate-900/40 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 md:p-12 shadow-2xl shadow-cyan-500/10"
      >
        <!-- Background Effects -->
        <div
          class="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-pink-500/5 to-cyan-500/5 rounded-3xl"
        ></div>
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,0,0.15),transparent_50%)] rounded-3xl"
        ></div>
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,20,147,0.15),transparent_50%)] rounded-3xl"
        ></div>

        <!-- Animated Border -->
        <div
          class="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style="padding: 2px; background: linear-gradient(45deg, transparent, rgba(0,191,255,0.3), transparent);"
        ></div>

        <div class="relative z-10">
          <div
            class="inline-block bg-gradient-to-r from-yellow-500/20 via-pink-500/20 to-cyan-500/20 border border-yellow-400/40 rounded-full px-6 py-3 mb-8 backdrop-blur-sm shadow-lg shadow-yellow-400/20"
          >
            <Sparkles class="inline w-4 h-4 text-yellow-300 mr-2" />
            <span
              class="text-yellow-300 text-sm font-semibold uppercase tracking-wider drop-shadow-lg"
              >Simple Process</span
            >
          </div>

          <h2
            class="text-5xl md:text-6xl lg:text-7xl font-black mb-8 relative animate-pulse"
          >
            <span
              class="bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-2xl"
              style="filter: drop-shadow(0 0 25px rgba(255,215,0,0.6)); animation: glowPulse 3s ease-in-out infinite;"
            >
              How It Works
            </span>
            <!-- Glow Effect -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-500 bg-clip-text text-transparent opacity-25 blur-sm scale-110 animate-pulse"
              style="animation-delay: 1s;"
            >
              How It Works
            </div>
          </h2>

          <p
            class="text-slate-100 text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-lg"
          >
            Get started with <span
              class="text-transparent bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text font-bold drop-shadow-lg"
              style="filter: drop-shadow(0 0 10px rgba(255,215,0,0.4));"
              >micropayments</span
            > in just three simple steps
          </p>
        </div>
      </div>
    </div>

    <!-- Steps -->
    <div
      class="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 place-items-center"
    >
      <!-- Step 1 -->
      <div
        class="animate-fadeInUp flex flex-col items-center text-center"
        style="animation-delay: 0.3s"
      >
        <div
          class="px-6 py-2 bg-transparent border-2 border-cyan-400 text-cyan-400 text-xl font-bold mb-6 shadow-lg shadow-cyan-400/20 animate-scaleIn backdrop-blur-sm"
          style="animation-delay: 0.5s; border-radius: 20px;"
        >
          01
        </div>
        <div
          class="relative bg-gradient-to-br from-slate-800/70 via-slate-800/50 to-slate-900/70 backdrop-blur-md p-8 border border-cyan-500/20 hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-400/10 transition-all duration-500 hover:-translate-y-3 w-full max-w-sm overflow-hidden group"
        >
          <!-- Background Pattern -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          ></div>
          <!-- Top border accent -->
          <div
            class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
          ></div>
          <!-- Decorative corner elements -->
          <div
            class="absolute top-3 right-3 w-1 h-1 bg-cyan-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
          <div
            class="absolute bottom-3 left-3 w-1 h-1 bg-purple-400 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300"
          ></div>

          <div class="relative z-10">
            <div
              class="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl mx-auto mb-6 shadow-lg shadow-cyan-400/30 group-hover:scale-110 transition-transform duration-300"
            >
              <Wallet size={32} color="white" />
            </div>
            <h3
              class="text-cyan-400 text-xl font-semibold mb-4 group-hover:text-cyan-300 transition-colors"
            >
              Connect Your Wallet
            </h3>
            <p class="text-slate-300 leading-relaxed mb-6">
              Securely connect your Aptos wallet to start sending and receiving
              micropayments instantly.
            </p>
            <div class="flex flex-wrap justify-center gap-2">
              <span
                class="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-medium border border-cyan-500/30 backdrop-blur-sm"
                >Secure</span
              >
              <span
                class="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-medium border border-cyan-500/30 backdrop-blur-sm"
                >Fast</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2 -->
      <div
        class="animate-fadeInUp flex flex-col items-center text-center"
        style="animation-delay: 0.6s"
      >
        <div
          class="px-6 py-2 bg-transparent border-2 border-purple-400 text-purple-400 text-xl font-bold mb-6 shadow-lg shadow-purple-400/20 animate-scaleIn backdrop-blur-sm"
          style="animation-delay: 0.8s; border-radius: 20px;"
        >
          02
        </div>
        <div
          class="relative bg-gradient-to-br from-slate-800/70 via-slate-800/50 to-slate-900/70 backdrop-blur-md p-8 border border-purple-500/20 hover:border-purple-400/40 hover:shadow-2xl hover:shadow-purple-400/10 transition-all duration-500 hover:-translate-y-3 w-full max-w-sm overflow-hidden group"
        >
          <!-- Background Pattern -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          ></div>
          <!-- Top border accent -->
          <div
            class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400"
          ></div>
          <!-- Decorative corner elements -->
          <div
            class="absolute top-3 right-3 w-1 h-1 bg-purple-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
          <div
            class="absolute bottom-3 left-3 w-1 h-1 bg-pink-400 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300"
          ></div>

          <div class="relative z-10">
            <div
              class="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-6 shadow-lg shadow-purple-400/30 group-hover:scale-110 transition-transform duration-300"
            >
              <Link size={32} color="white" />
            </div>
            <h3
              class="text-purple-400 text-xl font-semibold mb-4 group-hover:text-purple-300 transition-colors"
            >
              Create Payment Link
            </h3>
            <p class="text-slate-300 leading-relaxed mb-6">
              Generate a unique payment link or QR code that others can use to
              send you micropayments.
            </p>
            <div class="flex flex-wrap justify-center gap-2">
              <span
                class="bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-400 px-3 py-1 rounded-full text-xs font-medium border border-purple-500/30 backdrop-blur-sm"
                >Easy</span
              >
              <span
                class="bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-400 px-3 py-1 rounded-full text-xs font-medium border border-purple-500/30 backdrop-blur-sm"
                >Shareable</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3 -->
      <div
        class="animate-fadeInUp flex flex-col items-center text-center md:col-span-2 lg:col-span-1 md:col-start-1 lg:col-start-auto md:justify-self-center lg:justify-self-auto"
        style="animation-delay: 0.9s"
      >
        <div
          class="px-6 py-2 bg-transparent border-2 border-emerald-400 text-emerald-400 text-xl font-bold mb-6 shadow-lg shadow-emerald-400/20 animate-scaleIn backdrop-blur-sm"
          style="animation-delay: 1.1s; border-radius: 20px;"
        >
          03
        </div>

        <div
          class="relative bg-gradient-to-br from-slate-800/70 via-slate-800/50 to-slate-900/70 backdrop-blur-md p-8 border border-emerald-500/20 hover:border-emerald-400/40 hover:shadow-2xl hover:shadow-emerald-400/10 transition-all duration-500 hover:-translate-y-3 w-full max-w-sm overflow-hidden group"
        >
          <!-- Background Pattern -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          ></div>
          <!-- Top border accent -->
          <div
            class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400"
          ></div>
          <!-- Decorative corner elements -->
          <div
            class="absolute top-3 right-3 w-1 h-1 bg-emerald-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
          <div
            class="absolute bottom-3 left-3 w-1 h-1 bg-teal-400 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300"
          ></div>

          <div class="relative z-10">
            <div
              class="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl mx-auto mb-6 shadow-lg shadow-emerald-400/30 group-hover:scale-110 transition-transform duration-300"
            >
              <CheckCircle size={32} color="white" />
            </div>
            <h3
              class="text-emerald-400 text-xl font-semibold mb-4 group-hover:text-emerald-300 transition-colors"
            >
              Receive Payments
            </h3>
            <p class="text-slate-300 leading-relaxed mb-6">
              Accept instant micropayments with near-zero fees. Track all
              transactions in your dashboard.
            </p>
            <div class="flex flex-wrap justify-center gap-2">
              <span
                class="bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/30 backdrop-blur-sm"
                >Instant</span
              >
              <span
                class="bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/30 backdrop-blur-sm"
                >Low Fees</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
