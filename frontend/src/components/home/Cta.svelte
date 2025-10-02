<section class="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden">
 <!-- Background Effects -->
 <div class="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/95 to-slate-900/90"></div>
 <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(0,191,255,0.15),transparent_50%)]"></div>
 <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(138,43,226,0.15),transparent_50%)]"></div>

 <!-- Floating Particles -->
 <div class="absolute top-20 left-20 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-pulse"></div>
 <div class="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-pulse" style="animation-delay: 1s;"></div>
 <div class="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-cyan-300 rounded-full opacity-50 animate-pulse" style="animation-delay: 2s;"></div>
 <div class="absolute top-60 right-20 w-1 h-1 bg-purple-300 rounded-full opacity-30 animate-pulse" style="animation-delay: 3s;"></div>

 <!-- Main Content -->
 <div class="relative z-10 text-center max-w-4xl mx-auto px-8">
   <!-- Glassmorphism Container -->
   <div class="relative bg-gradient-to-br from-slate-800/40 via-slate-800/25 to-slate-900/40 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 md:p-12 shadow-2xl shadow-cyan-500/10 overflow-hidden group">
     <!-- Background Effects -->
     <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
     <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,191,255,0.1),transparent_70%)] rounded-3xl"></div>

     <!-- Animated Border -->
     <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style="padding: 2px; background: linear-gradient(45deg, transparent, rgba(0,191,255,0.3), transparent); animation: shimmer 3s ease-in-out infinite;"></div>

     <!-- Title -->
     <h2 class="text-4xl md:text-5xl lg:text-6xl font-black mb-8 relative z-10">
       <span class="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg"
             style="filter: drop-shadow(0 0 20px rgba(0,191,255,0.4));">
         Start Receiving Micropayments Today
       </span>
       <!-- Subtle Glow Effect -->
       <div class="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent opacity-20 blur-sm scale-105">
         Start Receiving Micropayments Today
       </div>
     </h2>

     <!-- Subtitle -->
     <p class="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
       Join thousands of users already earning with
       <span class="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-semibold">micro-transactions</span>
       on the Aptos blockchain
     </p>

     <!-- CTA Button -->
     <div class="relative group">
       <button class="relative w-full max-w-md h-16 text-xl font-bold cursor-pointer hover:scale-105 transition-all duration-300 overflow-hidden rounded-2xl">
         <!-- Main gradient background -->
         <div class="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl opacity-90 group-hover:opacity-100 transition-all duration-300"></div>

         <!-- Glow effect -->
         <div class="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>

         <!-- Shine effect -->
         <div class="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

         <!-- Border -->
         <div class="absolute inset-0 border border-white/20 rounded-2xl group-hover:border-white/40 transition-colors duration-300"></div>

         <!-- Inner glow -->
         <div class="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

         <!-- Button text -->
         <span class="relative z-10 flex items-center justify-center gap-3 text-white">
           <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
           </svg>
           Connect Wallet
         </span>
       </button>

       <!-- Button description -->
       <p class="text-gray-400 text-sm mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         Secure • Fast • Zero Fees
       </p>
     </div>
   </div>
 </div>
</section>

<style>
@keyframes shimmer {
 0% {
   background-position: -200% 0;
 }
 100% {
   background-position: 200% 0;
 }
}

@keyframes floatUp {
 0%, 100% {
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
 0%, 100% {
   transform: scale(1);
   opacity: 1;
 }
 50% {
   transform: scale(1.2);
   opacity: 0.7;
 }
}
</style>