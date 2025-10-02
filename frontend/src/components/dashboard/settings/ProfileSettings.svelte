<script lang="ts">
  import { useWallet } from "@/hooks/useWallet";
  import { updateProfile } from "@/services/api.services";
  import { showToast } from "@/stores/toastStore";
  import { User, Camera, Loader2, RotateCcw, Save } from "lucide-svelte";

  const { userStore } = useWallet();

  $: userProfile = $userStore;

  let formData = {
    nickname: '',
    avatar: '',
    bio: ''
  };

  let isLoading = false;
  let isDirty = false;

  $: if (userProfile) {
    formData = {
      nickname: userProfile.nickname || '',
      avatar: userProfile.avatar || '',
      bio: userProfile.bio || ''
    };
  }

  // Form validation
  $: isFormValid = formData.nickname.trim().length >= 2 && formData.nickname.trim().length <= 50;

  // Track form changes
  $: isDirty = JSON.stringify(formData) !== JSON.stringify({
    nickname: userProfile?.nickname || '',
    avatar: userProfile?.avatar || '',
    bio: userProfile?.bio || ''
  });

  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (!isFormValid || isLoading) return;

    isLoading = true;

    try {
      const response = await updateProfile({
        address: userProfile.address,
        nickname: formData.nickname.trim(),
        avatar: formData.avatar.trim(),
        bio: formData.bio.trim()
      });
      console.log('API response:', response);

      $userStore = { 
        ...$userStore, 
        nickname: formData.nickname.trim(), 
        avatar: formData.avatar.trim(), 
        bio: formData.bio.trim() 
      };

      isDirty = false;
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Error updating profile: ' + (error as Error).message, 'error');
    } finally {
      isLoading = false;
    }
  }

  function handleInput() {
    isDirty = true;
  }

  function resetForm() {
    formData = { 
      nickname: userProfile?.nickname || '', 
      avatar: userProfile?.avatar || '', 
      bio: userProfile?.bio || '' 
    };
    isDirty = false;
  }
</script>

<div class="mx-auto">
  <!-- Profile Settings Card -->
  <div class="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
    <!-- Efectos de fondo sutiles -->
    <div class="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-100/30 to-orange-100/20 rounded-full blur-2xl"></div>
    <div class="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-yellow-100/20 to-amber-100/15 rounded-full blur-3xl"></div>

    <div class="relative z-10 p-8">
      <form class="space-y-8" on:submit={handleSubmit}>
        <!-- Avatar Section Mejorada -->
        <div class="flex items-start gap-6">
          <div class="relative flex-shrink-0">
            <div class="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl flex items-center justify-center overflow-hidden border-2 border-amber-200/50 shadow-lg group hover:shadow-xl transition-all duration-300">
              {#if formData.avatar}
                <img 
                  src={formData.avatar} 
                  alt="Avatar preview" 
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                />
              {:else}
                <div class="bg-gradient-to-br from-amber-500 to-orange-500 p-3 rounded-2xl">
                  <User class="w-10 h-10 text-white" />
                </div>
              {/if}
            </div>
            <!-- Indicador de estado -->
            <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg">
              <div class="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <!-- Overlay de cámara en hover -->
            <div class="absolute inset-0 bg-black/50 rounded-3xl opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-200 cursor-pointer">
              <Camera class="w-6 h-6 text-white" />
            </div>
          </div>

          <div class="flex-1 space-y-3">
            <label class="block text-sm font-bold text-gray-800" for="avatar">
              Profile Picture
            </label>
            <input
              id="avatar"
              type="url"
              bind:value={formData.avatar}
              on:input={handleInput}
              class="w-full px-4 py-3 bg-amber-50/50 backdrop-blur-sm border border-amber-200/60 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all duration-200"
              placeholder="https://example.com/avatar.jpg"
            />
            <p class="text-xs text-gray-600 flex items-center gap-2">
              <span class="w-1 h-1 bg-amber-500 rounded-full"></span>
              Enter a URL to your profile picture
            </p>
          </div>
        </div>

        <!-- Display Name Field -->
        <div class="space-y-3">
          <label class="block text-sm font-bold text-gray-800" for="username">
            Display Name
          </label>
          <div class="relative">
            <input
              id="username"
              type="text"
              bind:value={formData.nickname}
              on:input={handleInput}
              class="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-200 {formData.nickname && !isFormValid 
                ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                : 'border-amber-200/60 focus:ring-amber-500/20 focus:border-amber-500'}"
              placeholder="Choose your display name"
            />
            <div class="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
              {formData.nickname.length}/50
            </div>
            {#if formData.nickname && !isFormValid}
              <p class="text-xs text-red-500 mt-2 flex items-center gap-2">
                <span class="w-1 h-1 bg-red-500 rounded-full"></span>
                Display name must be between 2-50 characters
              </p>
            {/if}
          </div>
        </div>

        <!-- Bio Field -->
        <div class="space-y-3">
          <label class="block text-sm font-bold text-gray-800" for="bio">
            Bio
          </label>
          <div class="relative">
            <textarea
              id="bio"
              rows="5"
              bind:value={formData.bio}
              on:input={handleInput}
              maxlength="160"
              class="w-full px-4 py-4 bg-white/70 backdrop-blur-sm border border-amber-200/60 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 resize-none"
              placeholder="Tell the world about yourself..."
            ></textarea>
            <div class="absolute bottom-4 right-4 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-lg">
              {formData.bio.length}/160
            </div>
          </div>
          <p class="text-xs text-gray-600 flex items-center gap-2">
            <span class="w-1 h-1 bg-amber-500 rounded-full"></span>
            Share a brief description about yourself and your interests
          </p>
        </div>

        <!-- Status Indicator -->
        {#if isDirty}
          <div class="bg-yellow-50/80 backdrop-blur-sm border border-yellow-200/60 rounded-2xl p-4">
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <p class="text-sm text-yellow-800 font-medium">You have unsaved changes</p>
            </div>
          </div>
        {/if}

        <!-- Action Buttons -->
        <div class="flex items-center gap-4 pt-6 border-t border-amber-100">
          <button
            type="button"
            on:click={resetForm}
            disabled={!isDirty || isLoading}
            class="flex-1 px-6 py-4 bg-white/80 backdrop-blur-sm hover:bg-gray-50/80 text-gray-700 font-semibold rounded-2xl border border-gray-200/60 hover:border-gray-300/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <RotateCcw class="w-4 h-4" />
            Reset Changes
          </button>

          <button
            type="submit"
            disabled={!isFormValid || !isDirty || isLoading}
            class="flex-1 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
          >
            {#if isLoading}
              <Loader2 class="w-4 h-4 animate-spin" />
              Saving...
            {:else}
              <Save class="w-4 h-4" />
              Save Changes
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
