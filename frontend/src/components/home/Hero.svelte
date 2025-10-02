<script lang="ts">
  import Canvas from "@/components/home/wallet/Canvas.svelte";
  import { BookOpen, Zap } from "lucide-svelte";

  import { onMount } from "svelte";

  import { useWallet } from "@/hooks/useWallet";

  const { connect, disconnect, isConnected, checkConnection, address } =
    useWallet();

  onMount(() => {
    if ($isConnected) {
      console.log("Wallet is connected with address:", $address);
    } else {
      // console.log("Wallet is not connected");
    }
  });

  const buttonTest = async () => {
    await connect();
  };
</script>

<section
  class=" relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
>
  <div class="hero-background">
    <div class="floating-node node1"></div>
    <div class="floating-node node2"></div>
    <div class="floating-node node3"></div>
    <div class="floating-node node4"></div>
  </div>

  <div
    class="hero-content w-full p-8 h-screen flex items-center justify-items-center md:absolute left-1/6 z-40"
  >
    <div class=" flex-1 max-w-[520px] text-left">
      <div class="hero-badge relative group">
        <!-- Background effect on hover -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
        ></div>

        <!-- Lightning bolt that blinks -->
        <Zap
          class="relative inline-block transition-all duration-300 z-10 group-hover:animate-pulse w-4 h-4 text-cyan-300"
        />

        <!-- Text with color transition -->
        <span
          class="relative text-cyan-300 group-hover:text-cyan-100 text-sm font-semibold uppercase tracking-wider drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300 ml-2 z-10"
          >Powered by Aptos Blockchain</span
        >
      </div>

      <!-- Enhanced Glassmorphism H1 -->
      <div class="h1-container relative mb-6 group">
        <!-- Glassmorphism Background Container -->
        <div
          class="relative bg-gradient-to-br from-slate-800/30 via-slate-800/15 to-slate-900/30 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 md:p-12 shadow-2xl shadow-cyan-500/10 overflow-hidden"
        >
          <!-- Background Effects -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"
          ></div>
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,191,255,0.15),transparent_50%)] rounded-3xl"
          ></div>
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(138,43,226,0.15),transparent_50%)] rounded-3xl"
          ></div>

          <!-- Animated Border -->
          <div
            class="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style="padding: 2px; background: linear-gradient(45deg, transparent, rgba(0,191,255,0.3), transparent); animation: shimmer 3s ease-in-out infinite;"
          ></div>

          <!-- Floating Particles -->
          <div
            class="absolute top-4 left-8 w-1 h-1 bg-cyan-400 rounded-full opacity-60"
            style="animation: floatUp 4s ease-in-out infinite, pulse 2s ease-in-out infinite; animation-delay: 0s;"
          ></div>
          <div
            class="absolute top-6 right-12 w-0.5 h-0.5 bg-purple-400 rounded-full opacity-40"
            style="animation: floatUp 5s ease-in-out infinite reverse, pulse 3s ease-in-out infinite; animation-delay: 1s;"
          ></div>
          <div
            class="absolute bottom-8 left-1/4 w-1 h-1 bg-cyan-300 rounded-full opacity-50"
            style="animation: floatUp 6s ease-in-out infinite, pulse 2.5s ease-in-out infinite; animation-delay: 2s;"
          ></div>

          <!-- Main Title -->
          <h1
            class="text-4xl md:text-5xl lg:text-[54px] font-black relative z-10"
          >
            <span
              class="break-words bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg relative"
              style="filter: drop-shadow(0 0 15px rgba(255,215,0,0.4)); animation: glowPulse 3s ease-in-out infinite;"
            >
              Instant Micropayments on Aptos
            </span>
            <!-- Subtle Glow Effect -->
            <div
              class="break-words absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-500 bg-clip-text text-transparent opacity-15 blur-sm scale-105"
            >
              Instant Micropayments on Aptos
            </div>
          </h1>
        </div>
      </div>

      <p class="hero-subtitle relative">
        <span class="relative z-10"
          >Send and receive payments as small as
        </span>
        <span
          class="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-bold drop-shadow-lg"
          style="filter: drop-shadow(0 0 10px rgba(0,191,255,0.3));">$0.01</span
        >
        <span class="relative z-10"> with near-zero fees. Perfect for </span>
        <span class="text-cyan-300 font-semibold">content creators</span>
        <span class="relative z-10">, </span>
        <span class="text-purple-300 font-semibold">local stores</span>
        <span class="relative z-10">, and </span>
        <span class="text-cyan-300 font-semibold">micro-transactions</span>
        <span class="relative z-10">.</span>
      </p>

      <div class="hero-stats">
        <div class="stat">
          <span class="stat-number">$0.01</span>
          <p class="stat-label text-white">Minimum Payment</p>
        </div>
        <div class="stat">
          <span class="stat-number">&lt;1s</span>
          <p class="stat-label text-white">Transaction Time</p>
        </div>
        <div class="stat">
          <span class="stat-number">~0</span>
          <p class="stat-label text-white">Network Fees</p>
        </div>
      </div>

      <div class="flex space-x-4">
        {#if $isConnected}
          <div class="w-full">
            <a
              href="/dashboard"
              class="
    group relative w-full h-12 overflow-hidden
    bg-gradient-to-r from-pink-500/40 via-purple-500/40 to-cyan-500/40
    hover:from-pink-400/50 hover:via-purple-400/50 hover:to-cyan-400/50
    backdrop-blur-lg
    rounded-2xl border-2
    border-pink-400/50 hover:border-pink-300/70
    text-white font-bold text-sm
    cursor-pointer
    transform hover:scale-[1.04] hover:-translate-y-1.5
    transition-all duration-300 ease-out
    shadow-2xl shadow-pink-500/50 hover:shadow-pink-400/70
    hover:shadow-3xl
    animate-pulse hover:animate-none
    before:absolute before:inset-0 before:rounded-2xl
    before:bg-gradient-to-r before:from-pink-500/50 before:via-purple-500/50 before:to-cyan-500/50
    before:opacity-0 hover:before:opacity-100
    before:transition-opacity before:duration-300
    flex items-center justify-center
    no-underline
  "
            >
              <span
                class="relative z-10 flex items-center justify-center h-full"
              >
                <div
                  class="w-3 h-3 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full mr-3 animate-spin"
                ></div>
                <span class="text-white font-semibold text-lg">
                  Dashboard
                </span>
              </span>

              <!-- Múltiples efectos de brillo -->
              <div
                class="
      absolute inset-0 opacity-0 group-hover:opacity-100
      bg-gradient-to-r from-transparent via-white/30 to-transparent
      transform -skew-x-12 -translate-x-full group-hover:translate-x-full
      transition-transform duration-1000 ease-out
    "
              ></div>

              <!-- Partículas brillantes -->
              <div
                class="absolute top-1 right-2 w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"
              ></div>
              <div
                class="absolute bottom-1 left-3 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping delay-100"
              ></div>
            </a>
          </div>
        {:else}
          <button
            onclick={buttonTest}
            class="rounded-md w-full h-12 cursor-pointer hover:scale-105 transition-all duration-300 relative group overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl opacity-90 group-hover:opacity-100 transition-all duration-300"
            ></div>
            <div
              class="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"
            ></div>
            <div
              class="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <div
              class="absolute inset-0 border border-white/20 rounded-2xl group-hover:border-white/40 transition-colors duration-300"
            ></div>
            <div
              class="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <span
              class="flex items-center text-center justify-center gap-2 relative z-10"
            >
              <Zap
                class="w-5 h-5 text-white group-hover:animate-pulse transition-transform duration-300 group-hover:scale-110"
              />
              <span class="text-white font-semibold text-lg"
                >Connect Wallet</span
              >
            </span>
          </button>
        {/if}
        <button
          class="w-full rounded-md h-12 cursor-pointer hover:scale-105 transition-all duration-300 relative group overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-slate-800/90 via-slate-700/90 to-slate-800/90 rounded-2xl backdrop-blur-sm border border-cyan-400/30 group-hover:border-cyan-400/60 transition-all duration-300"
          ></div>
          <div
            class="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
          <div
            class="absolute inset-0 border border-cyan-400/20 rounded-2xl group-hover:border-cyan-400/40 transition-colors duration-300"
          ></div>
          <div
            class="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
          <span
            class="flex items-center text-center justify-center gap-2 relative z-10"
          >
            <BookOpen
              class="w-5 h-5 text-cyan-300 group-hover:text-cyan-200 group-hover:animate-pulse transition-all duration-300 group-hover:scale-110"
            />
            <span class="text-white font-semibold text-lg"> Learn More</span>
          </span>
        </button>
      </div>
    </div>
  </div>

  <div class="h-screen w-full hidden md:block">
    <Canvas />
  </div>
</section>

<style>
  /* Define all keyframes first to ensure they load properly */
  /* Custom animations for Hero component */
  @keyframes floatUp {
    0%,
    100% {
      transform: translateY(0px) rotate(0deg);
    }
    33% {
      transform: translateY(-10px) rotate(1deg);
    }
    66% {
      transform: translateY(-5px) rotate(-1deg);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.7;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes glowPulse {
    0%,
    100% {
      text-shadow: 0 0 20px rgba(0, 191, 255, 0.5);
    }
    50% {
      text-shadow:
        0 0 30px rgba(0, 191, 255, 0.8),
        0 0 40px rgba(138, 43, 226, 0.6);
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes slideUpFadeIn {
    0% {
      transform: translateY(50px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .hero-content {
    transform: translateY(50px);
    opacity: 0;
    animation: slideUpFadeIn 1s ease-out 0.5s forwards;
  }

  .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0a0a23 0%, #1a1a2e 50%, #0a0a23 100%);
    z-index: -1;
  }

  .hero-background::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(1px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .hero-background::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      radial-gradient(
        circle at 20% 80%,
        rgba(138, 43, 226, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(0, 191, 255, 0.1) 0%,
        transparent 50%
      );
    animation: fadeIn 2s ease-in-out;
  }

  .floating-node {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(0, 191, 255, 0.4) 0%,
      rgba(0, 191, 255, 0.1) 70%
    );
    animation:
      float 6s ease-in-out infinite,
      pulse 3s ease-in-out infinite;
    box-shadow: 0 0 20px rgba(0, 191, 255, 0.3);
    backdrop-filter: blur(10px);
  }

  .floating-node::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60%;
    height: 60%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.3) 0%,
      transparent 70%
    );
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  .node1 {
    width: 20px;
    height: 20px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
    background: radial-gradient(
      circle,
      rgba(0, 191, 255, 0.5) 0%,
      rgba(0, 191, 255, 0.2) 70%
    );
  }

  .node2 {
    width: 15px;
    height: 15px;
    top: 60%;
    right: 15%;
    background: radial-gradient(
      circle,
      rgba(138, 43, 226, 0.5) 0%,
      rgba(138, 43, 226, 0.2) 70%
    );
    animation-delay: 2s;
  }

  .node3 {
    width: 25px;
    height: 25px;
    bottom: 30%;
    left: 20%;
    animation-delay: 4s;
    background: radial-gradient(
      circle,
      rgba(0, 191, 255, 0.5) 0%,
      rgba(0, 191, 255, 0.2) 70%
    );
  }

  .node4 {
    width: 18px;
    height: 18px;
    top: 40%;
    right: 30%;
    background: radial-gradient(
      circle,
      rgba(138, 43, 226, 0.5) 0%,
      rgba(138, 43, 226, 0.2) 70%
    );
    animation-delay: 1s;
  }

  /* Ensure animations work by overriding any conflicting styles */
  .hero-background .floating-node,
  .hero-background .floating-node.node1,
  .hero-background .floating-node.node2,
  .hero-background .floating-node.node3,
  .hero-background .floating-node.node4 {
    animation-fill-mode: both;
  }

  /* Specific selectors for floating particles */
  .h1-container .absolute:nth-child(1),
  .h1-container .absolute:nth-child(2),
  .h1-container .absolute:nth-child(3) {
    animation-fill-mode: both;
  }
</style>
