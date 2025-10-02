<script lang="ts">
  import type { UserProfile } from "@/types/types";
  import { walletService } from "@/services/walletServices";

  interface Props {
    profile: UserProfile;
    onUpdate: (profile: UserProfile) => void;
  }

  let { profile, onUpdate }: Props = $props();
  let saving = $state(false);

  async function handleSave() {
    saving = true;
    try {
      await walletService.updateProfile(profile);
      onUpdate(profile);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      saving = false;
    }
  }

  function generatePaymentLink() {
    return `https://aptosmicropay.com/u/${profile.username}`;
  }
</script>

<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 shadow-lg">
  <h3 class="text-lg font-semibold text-cyan-300 mb-6">Profile Settings</h3>

  <div class="space-y-6">
    <!-- Username -->
    <div>
      <label class="block text-sm text-gray-400 mb-2">Username</label>
      <input
        type="text"
        bind:value={profile.username}
        class="w-full px-3 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
        placeholder="Enter username"
      />
    </div>

    <!-- Public Name -->
    <div>
      <label class="block text-sm text-gray-400 mb-2">Public Name</label>
      <input
        type="text"
        bind:value={profile.publicName}
        class="w-full px-3 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
        placeholder="Enter public name"
      />
    </div>

    <!-- Avatar URL -->
    <div>
      <label class="block text-sm text-gray-400 mb-2">Avatar URL</label>
      <input
        type="url"
        bind:value={profile.avatar}
        class="w-full px-3 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
        placeholder="https://example.com/avatar.jpg"
      />
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm text-gray-400 mb-2">Description</label>
      <textarea
        bind:value={profile.description}
        rows="3"
        class="w-full px-3 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400 resize-none"
        placeholder="Tell your supporters about yourself..."
      ></textarea>
    </div>

    <!-- Notifications -->
    <div class="space-y-3">
      <label class="flex items-center">
        <input
          type="checkbox"
          bind:checked={profile.emailNotifications}
          class="mr-3 w-4 h-4 text-cyan-600 bg-slate-700 border-cyan-500/30 rounded focus:ring-cyan-500"
        />
        <span class="text-gray-300">Enable email notifications</span>
      </label>
      <label class="flex items-center">
        <input
          type="checkbox"
          bind:checked={profile.telegramNotifications}
          class="mr-3 w-4 h-4 text-cyan-600 bg-slate-700 border-cyan-500/30 rounded focus:ring-cyan-500"
        />
        <span class="text-gray-300">Enable Telegram notifications</span>
      </label>
    </div>

    <!-- Payment Link -->
    <div>
      <label class="block text-sm text-gray-400 mb-2">Payment Link</label>
      <div class="flex gap-2">
        <input
          type="text"
          value={generatePaymentLink()}
          readonly
          class="flex-1 px-3 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white"
        />
        <button
          onclick={() => navigator.clipboard.writeText(generatePaymentLink())}
          class="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
        >
          Copy
        </button>
      </div>
    </div>

    <!-- Save Button -->
    <button
      onclick={handleSave}
      disabled={saving}
      class="w-full relative group px-4 py-2 cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div class="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg opacity-90 group-hover:opacity-100 transition-all duration-300"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30 rounded-lg blur-sm group-hover:blur-md transition-all duration-300"></div>
      <span class="relative z-10 text-white font-semibold">
        {#if saving}
          Saving...
        {:else}
          Save Profile
        {/if}
      </span>
    </button>
  </div>
</div>