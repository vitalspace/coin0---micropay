<script lang="ts">
  import { useContract } from "@/hooks/useContract";
  import { useWallet } from "@/hooks/useWallet";
  import { showToast } from "@/stores/toastStore";
  import { improveCampaign, createCampaign as createCampaignAPI } from "@/services/api.services";
  import {
    ArrowLeft,
    Building2,
    Check,
    Heart,
    ShoppingBag,
    Sparkles,
    X
  } from "lucide-svelte";

  interface Props {
    onBack: () => void;
  }

  let { onBack }: Props = $props();

  // Campaign types
  const CAMPAIGN_TYPES = [
    {
      id: 0,
      name: "Donation",
      description: "Collect funds for a cause",
      icon: Heart,
    },
    {
      id: 1,
      name: "Business",
      description: "Accept payments for services",
      icon: Building2,
    },
    {
      id: 2,
      name: "Product",
      description: "Sell products or services",
      icon: ShoppingBag,
    },
  ];

  // Form state
  let selectedType = $state(0);
  let formData = $state({
    name: "",
    description: "",
    goal: "",
    price: "",
    image: "",
  });
  let isSubmitting = $state(false);
  let isImprovingName = $state(false);
  let isImprovingDescription = $state(false);
  let errors = $state<Record<string, string>>({});

  // Contract hook
  const { createCampaign } = useContract();
  const { address } = useWallet();

  function selectType(typeId: number) {
    selectedType = typeId;
    errors = {};
  }

  async function improveName() {
    if (!formData.name.trim()) return;

    isImprovingName = true;
    try {
      const response = await improveCampaign({
        field: 'name',
        context: formData.name,
        currentValue: formData.name,
      });
      formData.name = response.data.improvedText;
      showToast("Campaign name improved!", "success");
    } catch (error) {
      console.error("Error improving name:", error);
      showToast("Failed to improve campaign name", "error");
    } finally {
      isImprovingName = false;
    }
  }

  async function improveDescription() {
    if (!formData.description.trim()) return;

    isImprovingDescription = true;
    try {
      const response = await improveCampaign({
        field: 'description',
        context: formData.description,
        currentValue: formData.description,
      });
      formData.description = response.data.improvedText;
      showToast("Campaign description improved!", "success");
    } catch (error) {
      console.error("Error improving description:", error);
      showToast("Failed to improve campaign description", "error");
    } finally {
      isImprovingDescription = false;
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      errors.name = "Campaign name is required";
      return;
    }
    if (formData.name.length > 50) {
      errors.name = "Campaign name must be 50 characters or less";
      return;
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required";
      return;
    }
    if (formData.description.length > 256) {
      errors.description = "Description must be 256 characters or less";
      return;
    }
    if (!formData.image.trim() || !formData.image.match(/^https?:\/\/.+/)) {
      errors.image = "Valid image URL is required";
      return;
    }

    if (selectedType === 0) {
      if (
        !formData.goal ||
        isNaN(parseFloat(formData.goal)) ||
        parseFloat(formData.goal) <= 0
      ) {
        errors.goal = "Valid goal amount is required for donation campaigns";
        return;
      }
    } else if (selectedType === 1 || selectedType === 2) {
      if (
        !formData.price ||
        isNaN(parseFloat(formData.price)) ||
        parseFloat(formData.price) <= 0
      ) {
        errors.price = `Valid price is required for ${selectedType === 1 ? "business" : "product"} campaigns`;
        return;
      }
    }

    errors = {};
    isSubmitting = true;

    try {
      const campaignType = CAMPAIGN_TYPES[selectedType].name.toLowerCase();

      const campaignData = {
        type: campaignType,
        name: formData.name,
        description: formData.description,
        goal: selectedType === 0 ? parseFloat(formData.goal) : 0,
        price:
          selectedType === 1 || selectedType === 2
            ? parseFloat(formData.price)
            : 0,
        image: formData.image,
      };

      const MICRO_APT_MULTIPLIER = 100000000;

      const contractArgs = {
        type: selectedType.toString(), // Contract expects "0", "1", "2"
        name: campaignData.name,
        description: campaignData.description,
        goal: Math.floor(campaignData.goal * MICRO_APT_MULTIPLIER).toString(),
        price: Math.floor(campaignData.price * MICRO_APT_MULTIPLIER).toString(),
        image: campaignData.image,
      };


      // Create campaign on blockchain
      const contractResult = await createCampaign(
        contractArgs.type,
        contractArgs.name,
        contractArgs.description,
        contractArgs.goal,
        contractArgs.price,
        contractArgs.image
      );

      console.log("Contract result:", contractResult);

      // Get wallet address
      const userAddress = $address;
      if (!userAddress) {
        showToast("Wallet not connected", "error");
        return;
      }

      try {
        // Create campaign in backend database
        await createCampaignAPI({
          type: campaignType,
          name: formData.name,
          description: formData.description,
          goal: selectedType === 0 ? parseFloat(formData.goal) : undefined,
          price: selectedType === 1 || selectedType === 2 ? parseFloat(formData.price) : undefined,
          image: formData.image,
          contractId: contractResult.contractId,
          transaction_hash: contractResult.transactionHash,
          createdBy: userAddress,
        });
      } catch (backendError) {
        console.error("Failed to create campaign in backend:", backendError);
        showToast("Campaign created on blockchain but failed to save to database. Please contact support.", "error");
        return; // Don't reset form or go back
      }

      showToast("Campaign created successfully!", "success");

      formData = { name: "", description: "", goal: "", price: "", image: "" };
      selectedType = 0;
      onBack();
    } catch (error) {
      console.error("Error creating campaign:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      if (errorMessage.includes("wallet not found")) {
        showToast(
          "Please install an Aptos wallet (like Petra or Martian) and connect it to create campaigns.",
          "error"
        );
      } else if (errorMessage.includes("connect your Aptos wallet")) {
        showToast(
          "Please connect your Petra wallet to the application and try again.",
          "error"
        );
      } else {
        showToast(`Error creating campaign: ${errorMessage}`, "error");
      }
    } finally {
      isSubmitting = false;
    }
  }
</script>

<!-- Modal Overlay con glassmorfismo -->
<div
  class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
>
  <!-- Modal Content -->
  <div
    class="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-auto"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between p-8 border-b border-purple-100"
    >
      <div class="flex items-center gap-4">
        <button
          onclick={onBack}
          class="p-2 hover:bg-purple-100/50 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} class="text-purple-600" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Create Campaign</h1>
          <p class="text-sm text-gray-600">
            Choose your campaign type and details
          </p>
        </div>
      </div>
      <button
        onclick={onBack}
        class="p-2 hover:bg-purple-100/50 rounded-xl transition-colors"
      >
        <X size={20} class="text-purple-600" />
      </button>
    </div>

    <!-- Campaign Type Selection -->
    <div class="p-8">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Campaign Type</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {#each CAMPAIGN_TYPES as type}
          <button
            onclick={() => selectType(type.id)}
            class="w-full p-4 rounded-2xl border-2 transition-all text-left cursor-pointer group {selectedType ===
            type.id
              ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-lg shadow-purple-500/10'
              : 'border-white/20 bg-white/50 backdrop-blur-sm hover:border-purple-300 hover:bg-purple-50/50'}"
          >
            <div class="flex flex-col items-center text-center gap-3">
              <!-- Ícono más compacto -->
              <div
                class="p-3 rounded-xl {selectedType === type.id
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'}"
              >
                {#if type.id === 0}
                  <Heart size={24} />
                {:else if type.id === 1}
                  <Building2 size={24} />
                {:else if type.id === 2}
                  <ShoppingBag size={24} />
                {/if}
              </div>

              <!-- Contenido más compacto -->
              <div class="flex-1">
                <div class="font-bold text-gray-900 text-base mb-1">
                  {type.name}
                </div>
                <div class="text-xs text-gray-600 leading-tight">
                  {type.description}
                </div>
              </div>

              <!-- Check mark más pequeño -->
              {#if selectedType === type.id}
                <div
                  class="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md"
                >
                  <Check size={14} class="text-white" />
                </div>
              {:else}
                <!-- Espacio reservado más pequeño -->
                <div class="w-5 h-5"></div>
              {/if}
            </div>
          </button>
        {/each}
      </div>
    </div>

    <!-- Form -->
    <form onsubmit={handleSubmit} class="px-8 pb-8 space-y-6">
      <!-- Campaign Name -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="block text-sm font-bold text-gray-800">
            Campaign Name
            <span class="text-xs text-gray-500 font-normal ml-2"
              >({formData.name.length}/50)</span
            >
          </span>
          <button
            type="button"
            onclick={improveName}
            disabled={!formData.name.trim() || isImprovingName}
            class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg transition-all disabled:cursor-not-allowed"
          >
            {#if isImprovingName}
              <div class="w-3 h-3 border border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Improving...</span>
            {:else}
              <Sparkles size={12} />
              <span>Improve with AI</span>
            {/if}
          </button>
        </div>
        <input
          type="text"
          bind:value={formData.name}
          maxlength="50"
          placeholder="Enter campaign name"
          class="w-full px-4 py-3 border border-white/20 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all {errors.name
            ? 'border-red-500'
            : ''}"
        />
        {#if errors.name}
          <p class="text-sm text-red-600 mt-2">{errors.name}</p>
        {/if}
      </div>

      <!-- Description -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="block text-sm font-bold text-gray-800">
            Description
            <span class="text-xs text-gray-500 font-normal ml-2"
              >({formData.description.length}/256)</span
            >
          </span>
          <button
            type="button"
            onclick={improveDescription}
            disabled={!formData.description.trim() || isImprovingDescription}
            class="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg transition-all disabled:cursor-not-allowed"
          >
            {#if isImprovingDescription}
              <div class="w-3 h-3 border border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Improving...</span>
            {:else}
              <Sparkles size={12} />
              <span>Improve with AI</span>
            {/if}
          </button>
        </div>
        <textarea
          bind:value={formData.description}
          maxlength="256"
          rows="4"
          placeholder="Describe your campaign..."
          class="w-full px-4 py-3 border border-white/20 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all {errors.description
            ? 'border-red-500'
            : ''}"
        ></textarea>
        {#if errors.description}
          <p class="text-sm text-red-600 mt-2">{errors.description}</p>
        {/if}
      </div>

      <!-- Type-specific fields -->
      {#if selectedType === 0}
        <div>
          <span class="block text-sm font-bold text-gray-800 mb-3"
            >Goal (APT)</span
          >
          <input
            type="number"
            step="0.01"
            min="0"
            bind:value={formData.goal}
            placeholder="0.00"
            class="w-full px-4 py-3 border border-white/20 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all {errors.goal
              ? 'border-red-500'
              : ''}"
          />
          {#if errors.goal}
            <p class="text-sm text-red-600 mt-2">{errors.goal}</p>
          {/if}
        </div>
      {/if}

      {#if selectedType === 1 || selectedType === 2}
        <div>
          <span class="block text-sm font-bold text-gray-800 mb-3"
            >Price (APT)</span
          >
          <input
            type="number"
            step="0.01"
            min="0"
            bind:value={formData.price}
            placeholder="0.00"
            class="w-full px-4 py-3 border border-white/20 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all {errors.price
              ? 'border-red-500'
              : ''}"
          />
          {#if errors.price}
            <p class="text-sm text-red-600 mt-2">{errors.price}</p>
          {/if}
        </div>
      {/if}

      <!-- Image URL -->
      <div>
        <span class="block text-sm font-bold text-gray-800 mb-3">Image URL</span
        >
        <input
          type="url"
          bind:value={formData.image}
          placeholder="https://example.com/image.jpg"
          class="w-full px-4 py-3 border border-white/20 bg-white/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all {errors.image
            ? 'border-red-500'
            : ''}"
        />
        {#if errors.image}
          <p class="text-sm text-red-600 mt-2">{errors.image}</p>
        {/if}
      </div>

      <!-- Preview Image -->
      {#if formData.image}
        <div>
          <span class="block text-sm font-bold text-gray-800 mb-3">Preview</span
          >
          <div
            class="w-full h-40 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl overflow-hidden border border-purple-100"
          >
            <img
              src={formData.image}
              alt="Campaign preview"
              class="w-full h-full object-cover"
              onerror={() => {
                errors.image = "Invalid image URL";
              }}
            />
          </div>
        </div>
      {/if}

      <!-- Submit Buttons -->
      <div class="flex gap-4 pt-6">
        <button
          type="button"
          onclick={() => {
            showToast("Campaign creation cancelled", "warn");
            onBack();
          }}
          class="flex-1 px-6 py-4 text-gray-700 bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-gray-100/50 transition-all font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          class="flex-1 px-6 py-4 text-white rounded-xl transition-all font-semibold shadow-lg disabled:opacity-50 {isSubmitting
            ? 'bg-gray-400'
            : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl'}"
        >
          {#if isSubmitting}
            <div class="flex items-center justify-center gap-2">
              <div
                class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              <span>Creating...</span>
            </div>
          {:else}
            <span>Create Campaign</span>
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>
