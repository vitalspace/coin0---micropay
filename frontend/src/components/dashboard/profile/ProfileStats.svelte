<script>
  import { Globe } from "lucide-svelte";
  import { useWallet } from "@/hooks/useWallet";
  const { address } = useWallet();
</script>

 <div class="mb-6">
   <h2 class="text-xl font-bold text-gray-900 mb-1">Profile Statistics</h2>
   <p class="text-sm text-gray-500">Your profile performance metrics</p>
 </div>

 <!-- Stats Grid -->
 <div class="space-y-4 mb-8">
   <!-- Profile Views -->
   <div class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100/50">
     <div class="flex items-center space-x-3">
       <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
         <Globe class="w-5 h-5 text-white" />
       </div>
       <div>
         <p class="text-sm font-medium text-gray-600">Profile Views</p>
         <p class="text-xs text-gray-500">Last 30 days</p>
       </div>
     </div>
     <span class="text-2xl font-bold text-gray-900">120</span>
   </div>

   <!-- Total Supporters -->
   <div class="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100/50">
     <div class="flex items-center space-x-3">
       <div class="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
         <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
         </svg>
       </div>
       <div>
         <p class="text-sm font-medium text-gray-600">Total Supporters</p>
         <p class="text-xs text-gray-500">All time</p>
       </div>
     </div>
     <span class="text-2xl font-bold text-gray-900">350</span>
   </div>

   <!-- Success Rate -->
   <div class="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100/50">
     <div class="flex items-center space-x-3">
       <div class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
         <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
         </svg>
       </div>
       <div>
         <p class="text-sm font-medium text-gray-600">Success Rate</p>
         <p class="text-xs text-gray-500">Campaign completion</p>
       </div>
     </div>
     <span class="text-2xl font-bold text-emerald-600">95%</span>
   </div>

   <!-- Member Since -->
   <div class="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100/50">
     <div class="flex items-center space-x-3">
       <div class="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
         <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
         </svg>
       </div>
       <div>
         <p class="text-sm font-medium text-gray-600">Member Since</p>
         <p class="text-xs text-gray-500">Account created</p>
       </div>
     </div>
     <span class="text-lg font-semibold text-gray-900">Jan 2020</span>
   </div>
 </div>

 <!-- Action Button -->
 <a href="/u/{$address}" class="block">
   <button class="w-full h-12 bg-gradient-to-r from-slate-900 to-gray-800 text-white font-semibold rounded-xl hover:from-slate-800 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500/20 transition-all duration-200 flex items-center justify-center gap-2 group">
     <Globe class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
     View Public Profile
   </button>
 </a>
