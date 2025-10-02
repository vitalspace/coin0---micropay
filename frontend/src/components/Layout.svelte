<script>
  let isOpen = $state(false);
  import { useWallet } from "@/hooks/useWallet";
  import { Menu } from "lucide-svelte";
  import { onMount } from "svelte";
  const { isConnected, address, disconnect, connect } = useWallet();

  let isHomeRoute = $state(true);

  onMount(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      isHomeRoute = path === "/" || path === "/swap";
    };

    checkRoute();
    window.addEventListener("popstate", checkRoute);

    return () => window.removeEventListener("popstate", checkRoute);
  });
</script>

<header class="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b shadow-lg transition-all duration-500 {isHomeRoute ? 'bg-white/5 border-cyan-500/20 shadow-cyan-500/10' : 'bg-slate-800/85 border-purple-500/20 shadow-purple-500/10'}">
  <!-- Background Effects -->
  <div class="absolute inset-0 transition-all duration-500 bg-gradient-to-r {isHomeRoute ? 'from-white/10 via-white/5 to-white/10' : 'from-slate-800/90 via-slate-700/95 to-slate-800/90'}"></div>
  <div class="absolute inset-0 transition-all duration-500 {isHomeRoute ? 'bg-[radial-gradient(circle_at_20%_50%,rgba(0,191,255,0.1),transparent_50%)]' : 'bg-[radial-gradient(circle_at_20%_50%,rgba(147,51,234,0.1),transparent_50%)]'}"></div>

 <!-- Floating particles -->
 <div class="absolute top-4 left-20 w-1 h-1 bg-cyan-400 rounded-full opacity-40 animate-pulse"></div>
 <div class="absolute top-6 right-32 w-0.5 h-0.5 bg-purple-400 rounded-full opacity-30 animate-pulse" style="animation-delay: 1s;"></div>

 <div class="relative container mx-auto flex items-center justify-between p-4">
   <!-- Logo/Brand -->
   <a href="/" class="group relative">
     <span class="text-2xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg hover:drop-shadow-2xl transition-all duration-300">
       MicroPay
     </span>
     <!-- Subtle glow effect -->
     <div class="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent opacity-20 blur-sm scale-105">
       MicroPay
     </div>
   </a>

   <!-- Desktop Navigation -->
   <div class="flex items-center gap-8">
     <nav class="hidden md:flex gap-8">
       <a href="/swap" class="relative group px-3 py-2 text-gray-300 hover:text-white transition-all duration-300">
         <span class="relative z-10">Swap</span>
         <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
       </a>
       <!-- <a href="/services" class="relative group px-3 py-2 text-gray-300 hover:text-white transition-all duration-300">
         <span class="relative z-10">Services</span>
         <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
       </a> -->
       <a href="/dashboard" class="relative group px-3 py-2 text-gray-300 hover:text-white transition-all duration-300">
         <span class="relative z-10">Dashboard</span>
         <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
       </a>
     </nav>

     <!-- Wallet Connection Section -->
     <div class="hidden md:flex items-center gap-4">
       {#if $isConnected}
         <!-- Connected State -->
         <div class="flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm">
           <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
           <span class="text-green-300 font-mono text-sm">{$address.slice(0, 6)}...{$address.slice(-4)}</span>
         </div>

         <button
           onclick={disconnect}
           class="relative group px-4 py-2 cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:scale-105"
         >
           <div class="absolute inset-0 bg-gradient-to-r from-amber-600/90 to-orange-700/90 rounded-lg"></div>
           <div class="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-600/30 rounded-lg blur-sm group-hover:blur-md transition-all duration-300"></div>
           <div class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
           <span class="relative z-10 text-white font-semibold">Disconnect</span>
         </button>
       {:else}
         <!-- Disconnected State -->
         <button
           onclick={connect}
           class="relative group px-6 py-2 cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:scale-105"
         >
           <div class="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-lg opacity-90 group-hover:opacity-100 transition-all duration-300"></div>
           <div class="absolute inset-0 bg-gradient-to-r from-orange-300/30 via-red-300/30 to-pink-300/30 rounded-lg blur-sm group-hover:blur-md transition-all duration-300"></div>
           <div class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
           <div class="absolute inset-0 border border-white/20 rounded-lg group-hover:border-white/40 transition-colors duration-300"></div>
           <span class="relative z-10 flex items-center gap-2 text-white font-semibold">
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
             </svg>
             Connect Wallet
           </span>
         </button>
       {/if}
     </div>
   </div>

   <!-- Mobile Menu Button -->
   <button class="md:hidden relative group p-2 cursor-pointer" onclick={() => (isOpen = !isOpen)}>
     <Menu class="w-6 h-6 text-cyan-300 group-hover:text-cyan-100 transition-colors duration-300" />
     <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
   </button>

   <!-- Mobile Menu -->
   {#if isOpen}
     <div class="md:hidden absolute top-full left-0 right-0 bg-gradient-to-br from-slate-800/98 to-slate-900/98 backdrop-blur-xl border-b border-cyan-500/30 shadow-2xl z-50 animate-in slide-in-from-top-2 duration-300">
       <nav class="container mx-auto flex flex-col gap-2 p-4">
         <a href="/about" class="relative group px-4 py-3 text-gray-300 hover:text-white transition-all duration-300 rounded-lg" onclick={() => (isOpen = false)}>
           <span class="relative z-10">About</span>
           <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
         </a>
         <a href="/services" class="relative group px-4 py-3 text-gray-300 hover:text-white transition-all duration-300 rounded-lg" onclick={() => (isOpen = false)}>
           <span class="relative z-10">Services</span>
           <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
         </a>
         <a href="/contact" class="relative group px-4 py-3 text-gray-300 hover:text-white transition-all duration-300 rounded-lg" onclick={() => (isOpen = false)}>
           <span class="relative z-10">Contact</span>
           <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
         </a>

         <!-- Mobile Wallet Section -->
         <div class="border-t border-cyan-500/20 pt-4 mt-4">
           {#if $isConnected}
             <div class="flex items-center justify-between mb-4">
               <div class="flex items-center gap-2">
                 <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                 <span class="text-green-300 font-mono text-sm">{$address.slice(0, 6)}...{$address.slice(-4)}</span>
               </div>
             </div>
             <button
               onclick={() => { disconnect(); isOpen = false; }}
               class="w-full relative group px-4 py-3 cursor-pointer overflow-hidden rounded-lg transition-all duration-300"
             >
               <div class="absolute inset-0 bg-gradient-to-r from-amber-600/90 to-orange-700/90 rounded-lg"></div>
               <div class="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-orange-600/30 rounded-lg blur-sm group-hover:blur-md transition-all duration-300"></div>
               <span class="relative z-10 text-white font-semibold">Disconnect</span>
             </button>
           {:else}
             <button
               onclick={() => { connect(); isOpen = false; }}
               class="w-full relative group px-4 py-3 cursor-pointer overflow-hidden rounded-lg transition-all duration-300"
             >
               <div class="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-lg opacity-90 group-hover:opacity-100 transition-all duration-300"></div>
               <div class="absolute inset-0 bg-gradient-to-r from-orange-300/30 via-red-300/30 to-pink-300/30 rounded-lg blur-sm group-hover:blur-md transition-all duration-300"></div>
               <div class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
               <span class="relative z-10 flex items-center justify-center gap-2 text-white font-semibold">
                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                 </svg>
                 Connect Wallet
               </span>
             </button>
           {/if}
         </div>
       </nav>
     </div>
   {/if}
 </div>
</header>
