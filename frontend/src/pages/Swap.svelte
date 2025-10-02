<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowUpDown, Zap } from "lucide-svelte";

  import { useWallet } from "@/hooks/useWallet";

  const { connect, disconnect, isConnected, checkConnection, address } =
    useWallet();

  let fromChain = $state("Aptos");
  let toChain = $state("BSC");
  let amount = $state(0);

  const isc = $derived($isConnected);

  // Swap statistics
  const swapStats = $derived([
    { label: "Min Swap", value: "$0.01" },
    { label: "Avg Time", value: "< 2s" },
    { label: "Success Rate", value: "99.9%" }
  ]);

  onMount(() => {
    if (isc) {
      console.log("Wallet is connected with address:", $address);
    } else {
      console.log("Wallet is not connected");
    }
  });

  const handleSwap = () => {
    // Implement swap logic here
    console.log(`Swapping ${amount} from ${fromChain} to ${toChain}`);
  };

  const swapChains = () => {
    const temp = fromChain;
    fromChain = toChain;
    toChain = temp;
  };
</script>

<section
  class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
>
  <!-- Hero Background -->
  <div class="hero-background">
    <div class="floating-node node1"></div>
    <div class="floating-node node2"></div>
    <div class="floating-node node3"></div>
    <div class="floating-node node4"></div>
  </div>

  <div
    class="hero-content w-full p-8 h-screen flex items-center justify-center "
  >
    <div class="flex-1 max-w-[520px] text-left">
      <!-- Hero Badge -->
      <div class="hero-badge relative group mb-6">
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
          >Cross-Chain Swap Platform</span
        >
      </div>

      {#if isc}
        <!-- Enhanced Glassmorphism Container -->
        <div class="h1-container relative mb-6 group">
          <!-- Glassmorphism Background Container -->
          <div
            class="relative bg-gradient-to-br from-slate-800/30 via-slate-800/15 to-slate-900/30 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 md:p-12 shadow-2xl shadow-cyan-500/10 overflow-hidden"
          >
            <!-- Background Effects -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl pointer-events-none"
            ></div>
            <div
              class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,191,255,0.15),transparent_50%)] rounded-3xl pointer-events-none"
            ></div>
            <div
              class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(138,43,226,0.15),transparent_50%)] rounded-3xl pointer-events-none"
            ></div>

            <!-- Animated Border -->
            <div
              class="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style="padding: 2px; background: linear-gradient(45deg, transparent, rgba(0,191,255,0.3), transparent); animation: shimmer 3s ease-in-out infinite;"
            ></div>

            <!-- Floating Particles -->
            <div
              class="absolute top-4 left-8 w-1 h-1 bg-cyan-400 rounded-full opacity-60 pointer-events-none"
              style="animation: floatUp 4s ease-in-out infinite, pulse 2s ease-in-out infinite; animation-delay: 0s;"
            ></div>
            <div
              class="absolute top-6 right-12 w-0.5 h-0.5 bg-purple-400 rounded-full opacity-40 pointer-events-none"
              style="animation: floatUp 5s ease-in-out infinite reverse, pulse 3s ease-in-out infinite; animation-delay: 1s;"
            ></div>
            <div
              class="absolute bottom-8 left-1/4 w-1 h-1 bg-cyan-300 rounded-full opacity-50 pointer-events-none"
              style="animation: floatUp 6s ease-in-out infinite, pulse 2.5s ease-in-out infinite; animation-delay: 2s;"
            ></div>

            <!-- Enhanced Title -->
            <h1
              class="text-4xl md:text-5xl lg:text-[48px] font-black relative z-10 mb-4"
            >
              <span
                class="break-words bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg relative"
                style="filter: drop-shadow(0 0 15px rgba(255,215,0,0.4)); animation: glowPulse 3s ease-in-out infinite;"
              >
                Swap Tokens
              </span>
              <!-- Subtle Glow Effect -->
              <div
                class="break-words absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-500 bg-clip-text text-transparent opacity-15 blur-sm scale-105"
              >
                Swap Tokens
              </div>
            </h1>

            <p class="hero-subtitle relative mb-6">
              <span class="relative z-10 text-gray-300"
                >Swap between chains with </span>
              <span
                class="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-bold drop-shadow-lg"
                style="filter: drop-shadow(0 0 10px rgba(0,191,255,0.3));">lightning speed</span
              >
              <span class="relative z-10 text-gray-300"> and </span>
              <span class="text-cyan-300 font-semibold">minimal fees</span>
              <span class="relative z-10 text-gray-300">.</span>
            </p>

            <!-- Swap Statistics -->
            <div class="hero-stats flex justify-between mb-8">
              {#each swapStats as stat}
                <div class="stat text-center">
                  <span class="stat-number text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">{stat.value}</span>
                  <p class="stat-label text-sm text-gray-400 mt-1">{stat.label}</p>
                </div>
              {/each}
            </div>

            <!-- Enhanced Swap Form -->
            <form
              onsubmit={(e) => {
                e.preventDefault();
                handleSwap();
              }}
              class="space-y-6 relative z-10"
            >
              <!-- Chain Selection Section -->
              <div class="flex items-center justify-between mb-6">
                <div class="flex-1">
                  <span class="block text-cyan-300 text-sm font-semibold mb-3 uppercase tracking-wide"
                    >From Chain</span
                  >
                  <div class="relative group">
                    <select
                      bind:value={fromChain}
                      class="w-full p-4 rounded-xl bg-slate-700/50 border border-cyan-500/30 text-white focus:border-cyan-400 focus:outline-none transition-all duration-300 hover:border-cyan-400/50 hover:bg-slate-700/70"
                    >
                      <option value="Aptos">Aptos</option>
                      <option value="BSC">Binance Smart Chain</option>
                    </select>
                    <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
                <button
                  type="button"
                  onclick={swapChains}
                  class="mx-6 p-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 transition-all duration-300 hover:scale-110"
                >
                  <ArrowUpDown class="w-6 h-6 text-cyan-300 hover:text-cyan-200" />
                </button>
                <div class="flex-1">
                  <span class="block text-cyan-300 text-sm font-semibold mb-3 uppercase tracking-wide"
                    >To Chain</span
                  >
                  <div class="relative group">
                    <select
                      bind:value={toChain}
                      class="w-full p-4 rounded-xl bg-slate-700/50 border border-cyan-500/30 text-white focus:border-cyan-400 focus:outline-none transition-all duration-300 hover:border-cyan-400/50 hover:bg-slate-700/70"
                    >
                      <option value="BSC">Binance Smart Chain</option>
                      <option value="Aptos">Aptos</option>
                    </select>
                    <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              <!-- Amount Input -->
              <div class="mb-8">
                <span class="block text-cyan-300 text-sm font-semibold mb-3 uppercase tracking-wide"
                  >Amount to Swap</span
                >
                <div class="relative group">
                  <input
                    type="number"
                    bind:value={amount}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    class="w-full p-4 rounded-xl bg-slate-700/50 border border-cyan-500/30 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none transition-all duration-300 text-lg hover:border-cyan-400/50 hover:bg-slate-700/70"
                    required
                  />
                  <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              <!-- Enhanced Swap Button -->
              <button
                type="submit"
                class="w-full rounded-xl h-14 cursor-pointer hover:scale-105 transition-all duration-300 relative group overflow-hidden"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl opacity-90 group-hover:opacity-100 transition-all duration-300"
                ></div>
                <div
                  class="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"
                ></div>
                <div
                  class="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
                <div
                  class="absolute inset-0 border border-white/20 rounded-xl group-hover:border-white/40 transition-colors duration-300"
                ></div>
                <div
                  class="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-purple-600/20 to-pink-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
                <span
                  class="flex items-center text-center justify-center gap-3 relative z-10"
                >
                  <Zap
                    class="w-6 h-6 text-white group-hover:animate-pulse transition-transform duration-300 group-hover:scale-110"
                  />
                  <span class="text-white font-semibold text-xl"
                    >Execute Swap</span
                  >
                </span>
              </button>
            </form>
          </div>
        </div>
      {:else}
        <!-- Wallet Connection Section -->
        <div class="text-center mb-6">
          <p class="text-gray-300 mb-2">Connect your wallet to start swapping</p>
          <div class="hero-badge relative group inline-block mb-4">
            <Zap class="w-4 h-4 text-cyan-300 inline mr-2" />
            <span class="text-cyan-300 text-sm">Secure • Fast • Reliable</span>
          </div>
        </div>

        <button
          onclick={connect}
          class="w-full rounded-xl h-14 cursor-pointer hover:scale-105 transition-all duration-300 relative group overflow-hidden mb-4"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl opacity-90 group-hover:opacity-100 transition-all duration-300"
          ></div>
          <div
            class="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"
          ></div>
          <div
            class="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
          <div
            class="absolute inset-0 border border-white/20 rounded-xl group-hover:border-white/40 transition-colors duration-300"
          ></div>
          <div
            class="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-purple-600/20 to-pink-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
          <span
            class="flex items-center text-center justify-center gap-3 relative z-10"
          >
            <Zap
              class="w-6 h-6 text-white group-hover:animate-pulse transition-transform duration-300 group-hover:scale-110"
            />
            <span class="text-white font-semibold text-xl">Connect Wallet</span>
          </span>
        </button>

        <!-- Additional Info -->
        <div class="text-center">
          <p class="text-xs text-gray-400">
            Support for <span class="text-cyan-300">Aptos</span> and <span class="text-purple-300">BSC</span> networks
          </p>
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  /* Define all keyframes first to ensure they load properly */
  /* Custom animations for Swap component */
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
    /* position: absolute; */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0a0a23 0%, #1a1a2e 50%, #0a0a23 100%);
    /* z-index: -1; */
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

  /* Hero Badge Styles */
  .hero-badge {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    border-radius: 9999px;
    background: rgba(6, 182, 212, 0.1);
    border: 1px solid rgba(6, 182, 212, 0.3);
    backdrop-filter: blur(10px);
    margin-bottom: 1rem;
    transition: all 0.3s ease;
  }

  .hero-badge:hover {
    background: rgba(6, 182, 212, 0.15);
    border-color: rgba(6, 182, 212, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(6, 182, 212, 0.2);
  }

  /* Hero Stats Styles */
  .hero-stats {
    display: flex;
    justify-content: space-around;
    margin: 2rem 0;
    padding: 1.5rem 0;
    border-top: 1px solid rgba(6, 182, 212, 0.2);
    border-bottom: 1px solid rgba(6, 182, 212, 0.2);
  }

  .stat {
    text-align: center;
  }

  .stat-number {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #9ca3af;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Hero Subtitle Styles */
  .hero-subtitle {
    font-size: 1.125rem;
    line-height: 1.6;
    color: #d1d5db;
    margin-bottom: 2rem;
  }

  /* Hero Background Styles */
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

  /* Floating Nodes Styles */
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

  /* Individual Node Positioning and Colors */
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
</style>
