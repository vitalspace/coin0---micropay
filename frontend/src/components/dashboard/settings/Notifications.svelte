<script lang="ts">
  import { Bell } from "lucide-svelte";

  // Reactive state for notification toggles
  let newDonationsEnabled = true;
  let weeklyReportsEnabled = true;
  let campaignUpdatesEnabled = true;
</script>

<div
  class="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200/10 backdrop-blur-sm hover:shadow-md transition-all duration-300 space-x-3"
>
  <div class="grid grid-cols-1 gap-6">
    <div class="flex items-center">
      <Bell class="inline-block w-5 h-5 mr-2 text-gray-600" />
      <h2 class="text-lg font-semibold">Notifications</h2>
    </div>

    <div>
      <div class="flex justify-between items-center">
        <div>
          <p class="font-semibold">New Donations</p>
          <p class="text-sm text-gray-500">Get notified of new donations</p>
        </div>
        <div class="relative inline-flex items-center">
          <input
            type="checkbox"
            id="new-donations-toggle"
            bind:checked={newDonationsEnabled}
            class="sr-only peer"
          />
          <label
            for="new-donations-toggle"
            class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"
          ></label>
        </div>
      </div>

      <div class="flex justify-between items-center mt-4">
        <div>
          <p class="font-semibold">Weekly Reports</p>
          <p class="text-sm text-gray-500">Receive weekly analytics</p>
        </div>
        <div class="relative inline-flex items-center">
          <input
            type="checkbox"
            id="weekly-reports-toggle"
            bind:checked={weeklyReportsEnabled}
            class="sr-only peer"
          />
          <label
            for="weekly-reports-toggle"
            class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"
          ></label>
        </div>
      </div>

      <div class="flex justify-between items-center mt-4">
        <div>
          <p class="font-semibold">Campaign Updates</p>
          <p class="text-sm text-gray-500">Updates on campaign performance</p>
        </div>
        <div class="relative inline-flex items-center">
          <input
            type="checkbox"
            id="campaign-updates-toggle"
            bind:checked={campaignUpdatesEnabled}
            class="sr-only peer"
          />
          <label
            for="campaign-updates-toggle"
            class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"
          ></label>
        </div>
      </div>
    </div>
  </div>
</div>
