<script lang="ts">
  import { Shield } from "lucide-svelte";
  let publicProfileEnabled = true;
  let twoFactorEnabled = true;
</script>

<div
  class="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200/10 backdrop-blur-sm hover:shadow-md transition-all duration-300 space-x-3"
>
  <div>
    <div>
      <div class="flex items-center">
        <Shield class="inline-block w-5 h-5 mr-2 text-gray-600" />
        <h2 class="text-lg font-semibold">Privacy Settings</h2>
      </div>
    </div>

    <div class="flex justify-between items-center mt-4">
      <div>
        <p class="font-semibold">Public Profile</p>
        <p class="text-gray-600 text-sm">Make you profile visible</p>
      </div>

      <div class="relative inline-flex items-center">
        <input
          type="checkbox"
          id="public-profile-toggle"
          bind:checked={publicProfileEnabled}
          class="sr-only peer"
        />
        <label
          for="public-profile-toggle"
          class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"
        ></label>
      </div>
    </div>

    <div class="flex justify-between items-center mt-4">
      <div>
        <p class="font-semibold">Two-Factor Authentication</p>
        <p class="text-gray-600 text-sm">Display donation amounts</p>
      </div>
      <div class="relative inline-flex items-center">
        <input
          type="checkbox"
          id="two-factor-toggle"
          bind:checked={twoFactorEnabled}
          class="sr-only peer"
        />
        <label
          for="two-factor-toggle"
          class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"
        ></label>
      </div>
    </div>
  </div>
</div>
