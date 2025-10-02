<script lang="ts">
  import type { Campaign, CampaignType } from "@/types/types";
  import { walletService } from "@/services/walletServices";

  interface Props {
    campaign?: Campaign;
    onSave: (campaign: Campaign) => void;
    onCancel: () => void;
  }

  let { campaign, onSave, onCancel }: Props = $props();

  let formData = $state({
    type: 'donation' as CampaignType,
    title: '',
    description: '',
    goal: 0,
    price: 0,
    image: '',
    isActive: true,
  });

  let saving = $state(false);

  // Initialize form if editing
  $effect(() => {
    if (campaign) {
      formData = {
        type: campaign.type,
        title: campaign.title,
        description: campaign.description,
        goal: campaign.goal || 0,
        price: campaign.price || 0,
        image: campaign.image || '',
        isActive: campaign.isActive,
      };
    }
  });

  async function handleSave() {
    if (!formData.title.trim()) return;

    saving = true;
    try {
      let savedCampaign: Campaign;

      if (campaign) {
        // Update existing
        savedCampaign = await walletService.updateCampaign(campaign.id, {
          ...campaign,
          ...formData,
          paymentLink: campaign.paymentLink, // Keep existing link
        });
      } else {
        // Create new
        const newCampaignData = {
          ...formData,
          balance: 0,
          totalRaised: 0,
          donorCount: 0,
          paymentLink: `https://aptosmicropay.com/c/${Date.now()}`, // Generate link
        };
        savedCampaign = await walletService.createCampaign(newCampaignData);
      }

      onSave(savedCampaign);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      saving = false;
    }
  }
</script>

<div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 shadow-lg">
  <h3 class="text-lg font-semibold text-cyan-300 mb-6">
    {campaign ? 'Edit Campaign' : 'Create New Campaign'}
  </h3>

  <div class="space-y-6">
    <!-- Type -->
    <div>
      <label class="block text-sm text-gray-400 mb-2">Campaign Type</label>
      <select
        bind:value={formData.type}
        class="w-full px-3 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
      >
        <option value="donation">Donation</option>
        <option value="business">Business</option>
        <option value="product">Product</option>
      </select>
    </div>

    <!-- Title -->
    <div>
      <label class="block text-sm text-gray-400 mb-2">Title</label>
      <input
        type="text"
        bind:value={formData.title}
        placeholder="Enter campaign title"
        class="w-full px-3 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
      />
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm text-gray-400 mb-2">Description</label>
      <textarea
        bind:value={formData.description}
        rows="3"
        placeholder="Describe your campaign..."
        class="w-full px-3 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400 resize-none"
      ></textarea>
    </div>

    <!-- Goal/Price based on type -->
    {#if formData.type === 'donation'}
      <div>
        <label class="block text-sm text-gray-400 mb-2">Fundraising Goal (APT)</label>
        <input
          type="number"
          bind:value={formData.goal}
          min="0"
          step="0.01"
          placeholder="Enter goal amount"
          class="w-full px-3 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
        />
      </div>
    {:else if formData.type === 'product'}
      <div>
        <label class="block text-sm text-gray-400 mb-2">Product Price (APT)</label>
        <input
          type="number"
          bind:value={formData.price}
          min="0"
          step="0.01"
          placeholder="Enter product price"
          class="w-full px-3 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
        />
      </div>
    {/if}

    <!-- Image URL -->
    <div>
      <label class="block text-sm text-gray-400 mb-2">Image URL (optional)</label>
      <input
        type="url"
        bind:value={formData.image}
        placeholder="https://example.com/image.jpg"
        class="w-full px-3 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
      />
    </div>

    <!-- Active Status -->
    <div class="flex items-center">
      <input
        type="checkbox"
        id="isActive"
        bind:checked={formData.isActive}
        class="mr-3 w-4 h-4 text-cyan-600 bg-slate-700 border-cyan-500/30 rounded focus:ring-cyan-500"
      />
      <label for="isActive" class="text-gray-300">Campaign is active</label>
    </div>

    <!-- Buttons -->
    <div class="flex gap-4 pt-4">
      <button
        onclick={onCancel}
        class="flex-1 px-4 py-2 bg-slate-700/50 text-gray-300 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-colors"
      >
        Cancel
      </button>
      <button
        onclick={handleSave}
        disabled={saving || !formData.title.trim()}
        class="flex-1 relative group px-4 py-2 cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg opacity-90 group-hover:opacity-100 transition-all duration-300"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30 rounded-lg blur-sm group-hover:blur-md transition-all duration-300"></div>
        <span class="relative z-10 text-white font-semibold">
          {#if saving}
            Saving...
          {:else}
            {campaign ? 'Update' : 'Create'} Campaign
          {/if}
        </span>
      </button>
    </div>
  </div>
</div>